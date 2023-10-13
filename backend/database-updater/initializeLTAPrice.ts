import file from "./data/ltadata.json";

type DayValues = "Monthu" | "Weekday" | "Friday" | "Saturday" | "Sunday";

const maps: Record<DayValues, Array<string>> = {
  Monthu: ["Mon", "Tue", "Wed", "Thu"],
  Weekday: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  Friday: ["Fri"],
  Saturday: ["Sat"],
  Sunday: ["Sun"],
};

import { query } from "./model";

export default async function initializeLTAPrice() {
  // `INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
  let queries =
    "INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)\nVALUES ";
  file.forEach((element) => {
    let cur = "";
    if (
      element.Day !== "Monthu" &&
      element.Day !== "Weekday" &&
      element.Day !== "Friday" &&
      element.Day !== "Saturday" &&
      element.Day !== "Sunday"
    )
      console.log(element.Day);
    maps[element.Day as DayValues].forEach(
      (day) =>
        (cur += `('${element.CarParkID}', '${element.LotType}', '${day}', '${
          element.StartTime
        }', '${element.EndTime}', ${element.Price}, ${
          element.IsSingleEntry ? "TRUE" : "FALSE"
        }, NOW(), NOW()),`)
    );

    queries += cur;
  });
  queries = queries.slice(0, queries.length - 1);
  queries +=
    " ON DUPLICATE KEY UPDATE Price = VALUES(Price), UpdatedOn = VALUES(UpdatedOn);";
  await query(queries);

  console.log(
    `${new Date().toISOString()} Initialized price database with ${
      file.length
    } entries (LTA Price).`
  );
}
