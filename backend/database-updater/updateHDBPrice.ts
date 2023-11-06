import { query } from "./model";
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const codesCentralHDB = [
  "ACB",
  "BBB",
  "BRB1",
  "CY",
  "DUXM",
  "HLM",
  "KAB",
  "KAM",
  "KAS",
  "PRM",
  "SLS",
  "SR1",
  "SR2",
  "TPM",
  "UCS",
  "WCB",
];

export default async function updateHDBPrice() {
  try {
    // Insert prices of HDB car parks outside central area
    [...weekdays, "Sat", "Sun"].map(
      async (day) =>
        await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
    SELECT 
        CarParkID, 
        LotType, 
        '${day}' as Day,          
        '00:00:00' as StartTime, 
        '23:59:59' as EndTime,
        1.20 as Price,           
        FALSE as IsSingleEntry,  
        NOW() as CreatedOn,
        NOW() as UpdatedOn
    FROM MotorizedParking
    WHERE Agency = 'HDB'
    ON DUPLICATE KEY UPDATE
        Price = VALUES(Price), 
        UpdatedOn = VALUES(UpdatedOn);
    `)
    );
    // $1.20 per -half-hour between 7.00am and 5.00pm for Monday to Saturday
    [...weekdays, "Sat"].map(
      async (day) =>
        await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
      SELECT
            CarParkID, 
            LotType, 
            '${day}' as Day,          
            '07:00:00' as StartTime, 
            '17:00:00' as EndTime,
            2.40 as Price,           
            FALSE as IsSingleEntry,  
            NOW() as CreatedOn,
            NOW() as UpdatedOn
        FROM MotorizedParking
        WHERE Agency = 'HDB' AND CarParkID IN ('${codesCentralHDB.join("','")}')
        ON DUPLICATE KEY UPDATE
            Price = VALUES(Price), 
            UpdatedOn = VALUES(UpdatedOn);
        `)
    );

    // $0.60 per half-hour between 5.00pm and 11.59.59pm for Monday to Saturday
    [...weekdays, "Sat"].map(
      async (day) =>
        await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
        SELECT
              CarParkID, 
              LotType, 
              '${day}' as Day,          
              '17:00:01' as StartTime, 
              '23:59:59' as EndTime,
              1.20 as Price,           
              FALSE as IsSingleEntry,  
              NOW() as CreatedOn,
              NOW() as UpdatedOn
          FROM MotorizedParking
          WHERE Agency = 'HDB' AND CarParkID IN ('${codesCentralHDB.join(
            "','"
          )}')
          ON DUPLICATE KEY UPDATE
              Price = VALUES(Price), 
              UpdatedOn = VALUES(UpdatedOn);
          `)
    );

    // $0.60 per half-hour between 00.00am and 6.59.59am for Monday to Saturday
    [...weekdays, "Sat"].map(
      async (day) =>
        await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
        SELECT
              CarParkID, 
              LotType, 
              '${day}' as Day,          
              '00:00:00' as StartTime, 
              '06:59:59' as EndTime,
              1.20 as Price,           
              FALSE as IsSingleEntry,  
              NOW() as CreatedOn,
              NOW() as UpdatedOn
          FROM MotorizedParking
          WHERE Agency = 'HDB' AND CarParkID IN ('${codesCentralHDB.join(
            "','"
          )}')
          ON DUPLICATE KEY UPDATE
              Price = VALUES(Price), 
              UpdatedOn = VALUES(UpdatedOn);
          `)
    );

    // $0.60 per half-hour between for Sunday and Public Holidays
    await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
     SELECT
           CarParkID, 
           LotType, 
           'Sun' as Day,          
           '00:00:00' as StartTime, 
           '23:59:59' as EndTime,
           1.20 as Price,           
           FALSE as IsSingleEntry,  
           NOW() as CreatedOn,
           NOW() as UpdatedOn
       FROM MotorizedParking
       WHERE Agency = 'HDB' AND CarParkID IN ('${codesCentralHDB.join("','")}')
       ON DUPLICATE KEY UPDATE
           Price = VALUES(Price), 
           UpdatedOn = VALUES(UpdatedOn);
       `);

    console.log(
      `${new Date().toISOString()} Updated price database of with HDB prices.`
    );
  } catch (error) {
    console.log(error);
  }
}
