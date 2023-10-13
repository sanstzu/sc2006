import express from "express";
import searchPlace from "@/controllers/maps/searchPlace";
import fetchPlace from "@/controllers/maps/fetchPlace";

const router = express.Router();

router.get("/places/search", searchPlace);
router.get("/places/:id", fetchPlace);

export default router;
