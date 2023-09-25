import * as db from "./model";
import axios from "axios";

type CarPark = {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: string;
  Agency: string;
};

const axiosLTA = axios.create({
  headers: {
    AccountKey: "ygtw1kdYQ/6Dg5tIM5KW4A==",
  },
});

async function getParkingLots(skip: number) {
  const config: {
    $skip: number;
  } = {
    $skip: skip,
  };

  const response = await axiosLTA.get(
    `http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2?`,
    {
      params: config,
    }
  );
  return response.data.value as CarPark[];
}

function ResponseToQuery(response: CarPark[]) {
  let query =
    "INSERT INTO `MotorizedParking` (`CarParkID`, `LotType`, `Coordinate`, `Development`, `AvailableLots`,  `Agency`, `CreatedOn`, `UpdatedOn`) VALUES ";
  for (let i = 0; i < response.length; i++) {
    const element = response[i];
    const location = element.Location.split(" ").reverse().join(","); // lat, lon
    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    query += `("${element.CarParkID}", "${element.LotType}", ST_SRID(POINT(${location}), 4326), "${element.Development}", ${element.AvailableLots},  "${element.Agency}",  "${currentTime}", "${currentTime}")`;
    if (i != response.length - 1) {
      query += ", ";
    }
  }
  query +=
    " ON DUPLICATE KEY UPDATE `AvailableLots` = VALUES(`AvailableLots`), `UpdatedOn` = VALUES(`UpdatedOn`);";
  return query;
}

async function updateDatabase() {
  let arr: CarPark[] = [];

  do {
    const resp = await getParkingLots(arr.length);
    if (resp.length == 0) break;
    arr = arr.concat(resp);
  } while (true);

  const initialSize = arr.length;

  arr.filter((x) => {
    const isValidLotType =
      x.LotType == "C" || x.LotType == "Y" || x.LotType == "H";
    const isValidAgency =
      x.Agency == "HDB" || x.Agency == "URA" || x.Agency == "LTA";

    return isValidLotType && isValidAgency;
  });

  const query = ResponseToQuery(arr);

  console.log(
    `${new Date().toISOString()} Updated database with ${
      arr.length
    } entries and ${initialSize - arr.length} invalid entries.`
  );
}

// Main function starts here
db.initializeConnection()
  .then(() => {
    console.log(
      `${new Date().toISOString()} Initialized connection to database.`
    );

    updateDatabase();
    setInterval(updateDatabase, 1000 * 10); // every 30 seconds
    console.log(`${new Date().toISOString()} Updater is running!`);
  })
  .catch((err) => {
    console.log(
      `${new Date().toISOString()} Failed to initialize connection to database: ${err}`
    );
  });
