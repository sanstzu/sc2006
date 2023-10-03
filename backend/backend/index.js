import express from "express";
import helloRoute from "./routes/hello.js";

const app = express();

app.use(express.json());
app.use("/hello", helloRoute);

app.listen(3002, () => {
  console.log("Server is running on port 3000");
});
