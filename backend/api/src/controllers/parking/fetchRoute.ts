import { TravelModes, fetchRoutePath } from "@/services/googleMaps";
import { ResponseType } from "@/types/response";
import { Request, Response } from "express";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type RouteResponse = {
  routes: Coordinate[];
};

async function fetchRoute(
  req: Request,
  res: Response<ResponseType<RouteResponse>>
) {
  try {
    const { originLat, originLong, destLat, destLong, mode } = req.query;
    if (
      originLat === undefined ||
      originLong === undefined ||
      destLat === undefined ||
      destLong === undefined ||
      mode === undefined
    ) {
      return res.status(404).json({
        status: 0,
        message: "Invalid request query!",
      });
    }

    const origin: Coordinate = {
      latitude: parseFloat(originLat.toString()),
      longitude: parseFloat(originLong.toString()),
    };

    const destination: Coordinate = {
      latitude: parseFloat(destLat.toString()),
      longitude: parseFloat(destLong.toString()),
    };

    const travelMode = mode.toString();

    const routeRes = await fetchRoutePath(
      origin,
      destination,
      travelMode as TravelModes
    );

    return res.status(200).json({
      status: 0,
      message: "Route fetched successfully!",
      data: {
        routes: routeRes,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 1,
      message: "Internal server error!",
    });
  }
}

export default fetchRoute;
