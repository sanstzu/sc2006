import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";

type SearchPlaceType = {
  name: string;
  address: string;
  place_id: string;
};

type structuredFormatType = {
  main_text: string;
  main_text_matched_substrings: object[];
  secondary_text: string;
};

type rawResult = {
  description: string;
  matched_substrings: object[];
  place_id: string;
  reference: string;
  structured_formatting: structuredFormatType;
  terms: string[];
};

async function searchPlace(
  req: Request,
  res: Response<ResponseType<SearchPlaceType[]>>
) {
  try {
    const searchInput = req.query.input;
    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
    const resp = await axios.get(url, {
      headers: {},
      params: {
        key: process.env.GOOGLE_MAPS_KEY,
        input: searchInput,
        region: "SG",
      },
    });

    let respData: SearchPlaceType[] = [];
    let results = resp.data.predictions;

    results.forEach((result: rawResult) => {
      respData.push({
        name: result.structured_formatting.main_text,
        address: result.structured_formatting.secondary_text,
        place_id: result.place_id,
      });
    });

    res.status(200).json({
      status: 1,
      message: "success",
      data: respData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
}
export default searchPlace;
