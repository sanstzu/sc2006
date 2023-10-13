import initializeLTAPrice from "./initializeLTAPrice";
import updateHDBPrice from "./updateHDBPrice";
import updateURAPrice from "./updateURAPrice";
import updateAvailability from "./updateAvailability";
import { initializeConnection } from "./model";
// Initialize database values (HDB)
initializeConnection()
  .then(() => {
    console.log(
      `${new Date().toISOString()} Initialized connection to database.`
    );

    // Insert update functions here
    updateAvailability();
    setInterval(
      updateAvailability,
      1000 * parseInt(process.env.DB_UPDATER_AVAILABILITY_FREQUENCY ?? "12")
    ); // every 12 seconds

    updateHDBPrice();
    setInterval(
      updateHDBPrice,
      1000 * 60 * 60 * parseInt(process.env.DB_UPDATER_PRICE_FREQUENCY ?? "12")
    ); // every 12 hours

    updateURAPrice();
    setInterval(
      updateURAPrice,
      1000 * 60 * 60 * parseInt(process.env.DB_UPDATER_PRICE_FREQUENCY ?? "12")
    ); // every 12 hours

    initializeLTAPrice();
    console.log(`${new Date().toISOString()} Updater is running!`);
  })

  .catch((err) => {
    console.log(
      `${new Date().toISOString()} Failed to initialize connection to database: ${err}`
    );
  });

// Main function starts here
