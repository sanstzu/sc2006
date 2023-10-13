import { useAxiosLTA } from "./api";
import { query } from "./model";

type CarPark = {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: string;
  Agency: string;
};

async function getParkingLots(skip: number) {
  const config: {
    $skip: number;
  } = {
    $skip: skip,
  };
  const axiosLTA = useAxiosLTA();
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

export default async function updateAvailability() {
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

  const querytxt = ResponseToQuery(arr);
  await query(querytxt);

  console.log(
    `${new Date().toISOString()} Updated database with ${
      arr.length
    } entries and ${initialSize - arr.length} invalid entries.`
  );
}
