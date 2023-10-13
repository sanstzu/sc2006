import express from "express";
import fetchBicycleParking from "@/controllers/parking/fetchBicycleParking";
import fetchMotorizedParking from "@/controllers/parking/fetchMotorizedParking";
import searchBicycleParking from "@/controllers/parking/searchBicycleParking";
import searchMotorizedParking from "@/controllers/parking/searchMotorizedParking";

const router = express.Router();

router.get("/motorized/search", searchMotorizedParking);
router.get("/bicycle/search", searchBicycleParking);
router.get("/motorized/:id", fetchMotorizedParking);
router.get("/bicycle/:id", fetchBicycleParking);

export default router;
