import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type FetchPlaceType = any;

function fetchPlace(
  req: Request,
  res: Response<ResponseType<FetchPlaceType>>
) {
  // Will be deleted, implementation is located in src/services/googleMaps.ts
}

export default fetchPlace;
