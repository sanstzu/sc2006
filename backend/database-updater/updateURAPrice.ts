import { useAxiosURA } from "./api";
import { query } from "./model";

type Time = {
  hour: number;
  minute: number;
  second: number;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function parseTimeRange(start: string, minusOne: boolean): number {
  // format XX:XX AM

  // convert to seconds from 00:00:00
  const startTimeArr = start.slice(0, -3).split(".");
  const isStartPM = start.slice(-2) === "PM";
  const startSeconds =
    ((parseInt(startTimeArr[0]) % 12) * 3600 +
      parseInt(startTimeArr[1]) * 60 +
      86400 -
      (minusOne ? 1 : 0) +
      (isStartPM ? 43200 : 0)) %
    86400;

  return startSeconds;
}

function secondsToTimeString(sec: number): string {
  const hour = Math.floor(sec / 3600);
  const minute = Math.floor((sec - hour * 3600) / 60);
  const second = sec - hour * 3600 - minute * 60;
  return (
    hour.toString().padStart(2, "0") +
    ":" +
    minute.toString().padStart(2, "0") +
    ":" +
    second.toString().padStart(2, "0")
  );
}

export default async function updateURAPrice() {
  try {
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

    const formattedCarParkInfo: {
      carParkID: string;
      lotType: string;
      startTime: number;
      endTime: number;
      weekdayRate: number;
      weekdayIsSingleEntry: boolean;
      satdayRate: number;
      satdayIsSingleEntry: boolean;
      sundayRate: number;
      sundayIsSingleEntry: boolean;
    }[] = [];

    carparkInfo.forEach((x: any) => {
      if (
        parseTimeRange(x.startTime, false) < parseTimeRange(x.endTime, true)
      ) {
        formattedCarParkInfo.push({
          carParkID: x.ppCode,
          lotType:
            x.vehCat == "Car" ? "C" : x.vehCat == "Motorcycle" ? "Y" : "H",
          weekdayRate:
            parseInt(x.weekdayMin.slice(0, -5)) < 120
              ? parseFloat(x.weekdayRate.slice(1)) /
                (60 / parseInt(x.weekdayMin.slice(0, -5)))
              : parseFloat(x.weekdayRate.slice(1)),
          weekdayIsSingleEntry: parseInt(x.weekdayMin.slice(0, -5)) < 180,
          // XXXMin = "XXX mins"
          startTime: parseTimeRange(x.startTime, false),
          endTime: parseTimeRange(x.endTime, true),
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
        });
      } else {
        formattedCarParkInfo.push({
          carParkID: x.ppCode,
          lotType:
            x.vehCat == "Car" ? "C" : x.vehCat == "Motorcycle" ? "Y" : "H",
          weekdayRate:
            parseInt(x.weekdayMin.slice(0, -5)) < 120
              ? parseFloat(x.weekdayRate.slice(1)) /
                (60 / parseInt(x.weekdayMin.slice(0, -5)))
              : parseFloat(x.weekdayRate.slice(1)),
          weekdayIsSingleEntry: parseInt(x.weekdayMin.slice(0, -5)) < 180,
          // XXXMin = "XXX mins"
          startTime: parseTimeRange(x.startTime, false),
          endTime: parseTimeRange("12.00 AM", true),
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
        });
        formattedCarParkInfo.push({
          carParkID: x.ppCode,
          lotType:
            x.vehCat == "Car" ? "C" : x.vehCat == "Motorcycle" ? "Y" : "H",
          weekdayRate:
            parseInt(x.weekdayMin.slice(0, -5)) < 120
              ? parseFloat(x.weekdayRate.slice(1)) /
                (60 / parseInt(x.weekdayMin.slice(0, -5)))
              : parseFloat(x.weekdayRate.slice(1)),
          weekdayIsSingleEntry: parseInt(x.weekdayMin.slice(0, -5)) < 180,
          // XXXMin = "XXX mins"
          startTime: parseTimeRange("12.00 AM", false),
          endTime: parseTimeRange(x.endTime, true),
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
        });
      }
    });

    const weekdayValues: string[] = [];
    formattedCarParkInfo.forEach((x) => {
      weekdays.forEach((day) => {
        weekdayValues.push(
          `('${x.carParkID}', '${x.lotType}', '${day}', '${secondsToTimeString(
            x.startTime
          )}', '${secondsToTimeString(x.endTime)}', ${x.weekdayRate}, ${
            x.weekdayIsSingleEntry ? "TRUE" : "FALSE"
          }, NOW(), NOW())`
        );
      });
    });

    const satdayValues = formattedCarParkInfo.map((x) => {
      if (Number.isNaN(x.satdayRate)) console.log(x);
      return `('${x.carParkID}', '${x.lotType}', 'Sat', '${secondsToTimeString(
        x.startTime
      )}', '${secondsToTimeString(x.endTime)}', ${x.satdayRate}, ${
        x.satdayIsSingleEntry ? "TRUE" : "FALSE"
      }, NOW(), NOW())`;
    });

    const sundayValues = formattedCarParkInfo.map((x) => {
      if (Number.isNaN(x.sundayRate)) console.log(x);
      return `('${x.carParkID}', '${x.lotType}', 'Sun', '${secondsToTimeString(
        x.startTime
      )}', '${secondsToTimeString(x.endTime)}', ${x.sundayRate}, ${
        x.sundayIsSingleEntry ? "TRUE" : "FALSE"
      }, NOW(), NOW())`;
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
  } catch (error) {
    console.log(error);
  }
}
