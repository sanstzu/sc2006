import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";

type GetBicycleParkingType = {
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

async function fetchBicycleParking(
  req: Request,
  res: Response<ResponseType<GetBicycleParkingType>>
) {
  const name: string = req.params.id;
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
  result.forEach((obj: GetBicycleParkingType) => {
    let objCoor: coordinate = {latitude: obj.Latitude, longitude: obj.Longitude};
    obj.Distance = getDistance(coor, objCoor);
  });
  
  let parkingDetails: GetBicycleParkingType = result.find((obj: GetBicycleParkingType) => (
    obj.Description.toLowerCase() === name.toLowerCase()
  ));
  console.log(parkingDetails)

  res.status(200).json({
    status : 1,
    message : "success",
    data : parkingDetails
  });  
}

export default fetchBicycleParking;
