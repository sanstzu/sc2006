import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type SearchBicycleParkingType = any;

function searchBicycleParking(
  req: Request,
  res: Response<ResponseType<SearchBicycleParkingType>>
) {}

export default searchBicycleParking;
