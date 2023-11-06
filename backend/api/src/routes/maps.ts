import express from "express";
import searchPlace from "@/controllers/maps/searchPlace";
import fetchPlace from "@/controllers/maps/fetchPlace";
import fetchRoute from "@/controllers/parking/fetchRoute";

const router = express.Router();

router.get("/places/search", searchPlace);
router.get("/places/:id", fetchPlace);
router.get("/routes", fetchRoute);

export default router;
