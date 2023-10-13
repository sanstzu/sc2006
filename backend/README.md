# Backend

## Setup

To start the database and database updater using Docker, run the following command from repository root:

```bash
cd backend
docker-compose up -u
```

To start the backend API for development purposes, run the following command from repository root:

```bash
cd backend/api
npm install
npm run dev
```

For production purposes, run the following command from repository root:

```bash
cd backend/api
npm install
npm run prod
```

parking
router.get("/motorized/search", searchMotorizedParking);
router.get("/bicycle/search", searchBicycleParking);
router.get("/motorized/:id", fetchMotorizedParking);
router.get("/bicycle/:id", fetchBicycleParking);

maps
router.get("/places/search", searchPlace);
router.get("/places/:id", fetchPlace);

## Backend API

There are two main routes in the backend API, `/maps` and `/carparks`.

### `/maps` Route

| Route                 | Method | Description                              |
| --------------------- | ------ | ---------------------------------------- |
| `/maps/places/search` | `GET`  | Search for places based on given keyword |
| `/maps/places/:id`    | `GET`  | Fetch a place based on given ID          |

### `/parking` Route

| Route                       | Method | Description                                            |
| --------------------------- | ------ | ------------------------------------------------------ |
| `/parking/motorized/search` | `GET`  | Search for motorized parking based on given coordinate |
| `/parking/bicycle/search`   | `GET`  | Search for bicycle parking based on given coordinate   |
| `/parking/motorized/:id`    | `GET`  | Fetch a motorized parking details based on given ID    |
| `/parking/bicycle/:id`      | `GET`  | Fetch a bicycle parking details based on given ID      |

## Database

The initialized database contains two tables, `MotorizedParking` and `ParkingPrice`.

The `MotorizedParking` table contains the following columns:
|Column Name|Type|Description|
|---|---|---|
|`CarParkID`|`VARCHAR(25)`|Unique identifier for a car park|
|`LotType`|`VARCHAR(1)`|Type of parking lot, either `C` for car, `Y` for motorcycle, 'H' for heavy vehicles|
|`Coordinate`|`POINT`|Coordinates of the car park (`SRID 4326`)|
|`Development`|`VARCHAR(150)`|Name of the car park|
|`AvailableLots`|`INT`|Number of available lots in the car park|
|`Agency`|`VARCHAR(3)`|Agency that manages the car park|
|`CreatedOn`|`DATETIME`|Timestamp of when the car park was created|
|`UpdatedOn`|`DATETIME`|Timestamp of when the car park was last updated|

\
The `ParkingPrice` table contains the following columns:
|Column Name|Type|Description|
|---|---|---|
|`CarParkID`|`VARCHAR(25)`|Unique identifier for a car park |
|`LotType`|`VARCHAR(1)`|Type of parking lot, either `C` for car, `Y` for motorcycle, 'H' for heavy vehicles|
|`Day`|`VARCHAR(10)`|Day of the week, either `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`|
|`StartTime`|`TIME`|Start time of the parking price|
|`EndTime`|`TIME`|End time of the parking price|
|`Price`|`DECIMAL(5,2)`|Price of the parking price|
|`IsSingleEntry`|`BOOLEAN`|Whether the parking price is for single entry or multiple entry|
|`CreatedOn`|`DATETIME`|Timestamp of when the parking price was created|
|`UpdatedOn`|`DATETIME`|Timestamp of when the parking price was last updated|

## Database Updater

The database updater uses Node.js in TypeScript to update the database with the latest car park information from several dynamic sources and also static sources.

The frequency of updates is configurable in `backend/.env` with the `DB_UPDATER_AVAILABILITY_FREQUENCY` or `DB_UPDATER_PRICE_FREQUENCY` variables. The default value are 12 seconds and 12 hours respectively.
