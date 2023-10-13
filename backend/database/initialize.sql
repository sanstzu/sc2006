USE `db`

CREATE TABLE IF NOT EXISTS `MotorizedParking` (
    -- Apparently same CarParkID with different LotTypes exist
	`CarParkID` VARCHAR(25) NOT NULL, 
    `LotType` VARCHAR(1) NOT NULL,
    `Coordinate` POINT NOT NULL SRID 4326,
    `Development` VARCHAR(150) NOT NULL,
    `AvailableLots` INT,
    `Agency` VARCHAR(3) NOT NULL,
    `CreatedOn` DATETIME NOT NULL,
    `UpdatedOn` DATETIME NOT NULL,
    PRIMARY KEY (`CarParkID`, `LotType`),
    SPATIAL INDEX (`Coordinate`),
    INDEX (`LotType`)
);

CREATE TABLE IF NOT EXISTS `ParkingPrice` (
    -- Apparently same CarParkID with different LotTypes exist
	`CarParkID` VARCHAR(25) NOT NULL, 
    `LotType` VARCHAR(1) NOT NULL,
    `Day` VARCHAR(10) NOT NULL, -- mon, tue, wed, thu, fri, sat, sun
    `StartTime` TIME NOT NULL,
    `EndTime` TIME NOT NULL,
    `Price` DECIMAL(5,2) NOT NULL,
    `IsSingleEntry` BOOLEAN NOT NULL,
    `CreatedOn` DATETIME NOT NULL,
    `UpdatedOn` DATETIME NOT NULL,
    PRIMARY KEY (`CarParkID`, `LotType`, `Day`, `StartTime`),
    INDEX (`Price`)
);