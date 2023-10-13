import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type FetchPlaceType = any;

function fetchPlace(
  req: Request,
  res: Response<ResponseType<FetchPlaceType>>
) {}

export default fetchPlace;
