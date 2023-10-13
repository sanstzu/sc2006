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
  // Insert prices of HDB car parks outside central area
  weekdays.map(
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
  weekdays.map(
    async (day) =>
      await query(`INSERT INTO ParkingPrice (CarParkID, LotType, Day, StartTime, EndTime, Price, IsSingleEntry, CreatedOn, UpdatedOn)
      SELECT
            CarParkID, 
            LotType, 
            '${day}' as Day,          
            '00:00:00' as StartTime, 
            '23:59:59' as EndTime,
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

  const count = await query(
    `SELECT COUNT(*) FROM ParkingPrice WHERE CarParkID IN ('${codesCentralHDB.join(
      "','"
    )}')`
  );
  console.log(count);

  console.log(
    `${new Date().toISOString()} Updated price database of with HDB prices.`
  );
}
