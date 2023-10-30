import express from "express";
import mapsRoutes from "./routes/maps";
import parkingRoutes from "./routes/parking";
import { initializeConnection } from "./services/database";

const app = express();
const port = 8080;

app.use(express.json());

app.use("/maps", mapsRoutes);
app.use("/parking", parkingRoutes);

initializeConnection().then(() => {
  console.log("Database connection initialized");
  app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
});
