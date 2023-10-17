import express from "express";
import mapsRoutes from "./routes/maps";
import parkingRoutes from "./routes/parking";

const app = express();
const port = 8080;

app.use(express.json());

app.use("/maps", mapsRoutes);
app.use("/parking", parkingRoutes);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
