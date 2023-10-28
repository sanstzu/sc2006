import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";

type GetBicycleParkingType = {
  type: "Bicycle";
  Name: string;
  RackType: string;
  RackCount: number;
  ShelterIndicator: "Y" | "N";
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
  let respData: GetBicycleParkingType[] = [];

  result.forEach((obj: {
    Latitude: number;
    Longitude: number;
    Description: string;
    RackType: string;
    RackCount: number;
    ShelterIndicator: "Y" | "N";
  }) => {
    let objCoor: coordinate = {latitude: obj.Latitude, longitude: obj.Longitude};
    
    respData.push({
      type: "Bicycle",
      Name: obj.Description,
      RackType: obj.RackType,
      RackCount: obj.RackCount,
      ShelterIndicator: obj.ShelterIndicator,
      Distance: getDistance(coor, objCoor),
    });
  });
  
  let parkingDetails: GetBicycleParkingType;
  const checker: any = respData.find((obj: GetBicycleParkingType) => (
    obj.Name.toLowerCase() === name.toLowerCase()
  ));

  if (checker === undefined) {
    return res.status(404).json({
      status : 0,
      message : "Bike park station not found!"
    });
  }
  else {
    parkingDetails = checker;
  }

  res.status(200).json({
    status : 1,
    message : "success",
    data : parkingDetails
  });  
}

export default fetchBicycleParking;
