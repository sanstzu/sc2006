import express from "express";
import { helloWorld } from "../controllers/hello.js";

const router = express.Router();

router.get("/world", helloWorld);

export default router;
