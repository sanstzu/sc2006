import { useAxiosURA } from "./api";
import { query } from "./model";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default async function updateURAPrice() {
  const axiosURA = useAxiosURA();
  const response = await axiosURA.get(
    `https://www.ura.gov.sg/uraDataService/insertNewToken.action`
  );
  const token = response.data.Result;

  const axiosAuthURA = useAxiosURA(token);

  const response2 = await axiosAuthURA.get(
    `https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details`
  );

  const carparkInfo: any[] = response2.data.Result;

  const formattedCarParkInfo = carparkInfo.map((x: any) => {
    return {
      carParkID: x.ppCode,
      lotType: x.vehCat == "Car" ? "C" : x.vehCat == "Motorcycle" ? "Y" : "H",
      weekdayRate:
        parseInt(x.weekdayMin.slice(0, -5)) < 120
          ? parseFloat(x.weekdayRate.slice(1)) /
            (60 / parseInt(x.weekdayMin.slice(0, -5)))
          : parseFloat(x.weekdayRate.slice(1)),
      weekdayIsSingleEntry: parseInt(x.weekdayMin.slice(0, -5)) < 180,
      // XXXMin = "XXX mins"

      satdayRate:
        parseInt(x.satdayMin.slice(0, -5)) < 120
          ? parseFloat(x.satdayRate.slice(1)) /
            (60 / parseInt(x.satdayMin.slice(0, -5)))
          : parseFloat(x.satdayRate.slice(1)),
      satdayIsSingleEntry: parseInt(x.satdayMin.slice(0, -5)) < 180,
      sundayRate:
        parseInt(x.sunPHMin.slice(0, -5)) < 120
          ? parseFloat(x.sunPHRate.slice(1)) /
            (60 / parseInt(x.sunPHMin.slice(0, -5)))
          : parseFloat(x.sunPHRate.slice(1)),
      sundayIsSingleEntry: parseInt(x.sunPHMin.slice(0, -5)) < 180,
    };
  });

  const weekdayValues = formattedCarParkInfo.map((x) => {
    return weekdays.map((day) => {
      if (Number.isNaN(x.weekdayRate)) console.log(x);
      return `('${x.carParkID}', '${
        x.lotType
      }', '${day}', '00:00:00', '23:59:59', ${x.weekdayRate}, ${
        x.weekdayIsSingleEntry ? "TRUE" : "FALSE"
      }, NOW(), NOW())`;
    });
  });

  const satdayValues = formattedCarParkInfo.map((x) => {
    if (Number.isNaN(x.satdayRate)) console.log(x);
    return `('${x.carParkID}', '${x.lotType}', 'Sat', '00:00:00', '23:59:59', ${
      x.satdayRate
    }, ${x.satdayIsSingleEntry ? "TRUE" : "FALSE"}, NOW(), NOW())`;
  });

  const sundayValues = formattedCarParkInfo.map((x) => {
    if (Number.isNaN(x.sundayRate)) console.log(x);
    return `('${x.carParkID}', '${x.lotType}', 'Sun', '00:00:00', '23:59:59', ${
      x.sundayRate
    }, ${x.sundayIsSingleEntry ? "TRUE" : "FALSE"}, NOW(), NOW())`;
  });

  const querytxt = `INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn) VALUES ${weekdayValues.join(
    ","
  )}, ${satdayValues.join(",")}, ${sundayValues.join(
    ","
  )} ON DUPLICATE KEY UPDATE Price = VALUES(Price), UpdatedOn = VALUES(UpdatedOn);`;

  await query(querytxt);

  console.log(
    `${new Date().toISOString()} Updated price database with ${
      formattedCarParkInfo.length
    } entries (URA Price).`
  );
}
