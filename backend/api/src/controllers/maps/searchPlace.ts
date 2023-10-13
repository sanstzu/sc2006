import { Request, Response } from "express";
import { ResponseType } from "@/types/response";

type SearchPlaceType = any;

function searchPlace(
  req: Request,
  res: Response<ResponseType<SearchPlaceType>>
) {}

export default searchPlace;
