import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";
type SearchBicycleParkingType = {
  Latitude: number;
  Longitude: number;
  Description: string;
  RackType: string;
  RackCount: string;
  SheltherIndicator: String;
  Distance: number;
};

type coordinate = {
  latitude: number;
  longitude: number;
};

async function searchBicycleParking(
  req: Request,
  res: Response<ResponseType<SearchBicycleParkingType[]>>
) {
  const coor: coordinate = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };

  const key = process.env.DB_UPDATER_LTA_KEY;
  const url =
    "http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2";

  const resp = await axios.get(url, {
    headers: {
      accountKey: key,
    },
    params: {
      Lat: req.body.latitude,
      Long: req.body.longitude,
      Dist: 1,
    },
  });

  let result = resp.data.value;
  result.forEach((obj: SearchBicycleParkingType) => {
    let objCoor: coordinate = {latitude: obj.Latitude, longitude: obj.Longitude};
    obj.Distance = getDistance(coor, objCoor);
  });


  let sortedResult: SearchBicycleParkingType[] = result.sort((obj1: SearchBicycleParkingType, obj2: SearchBicycleParkingType) => {
    return obj1.Distance - obj2.Distance;
  });

  res.status(200).json({
    status: 1,
    message: "success",
    data: sortedResult,
  });
}
export default searchBicycleParking;
