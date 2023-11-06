import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";

type GetBicycleParkingType = {
  type: "Bicycle";
  name: string;
  coordinate: coordinate;
  rackType: string;
  rackCount: number;
  shelterIndicator: "Y" | "N";
  distance?: number;
};

type coordinate = {
  latitude: number;
  longitude: number;
};

async function fetchBicycleParking(
  req: Request,
  res: Response<ResponseType<GetBicycleParkingType>>
) {
  let Qcoor: coordinate;
  let coor: coordinate;
  const name: string = req.params.id;
  if (req.query.Qlatitude !== undefined && req.query.Qlongitude !== undefined) {
      Qcoor = {
      latitude: parseFloat(req.query.Qlatitude.toString()),
      longitude: parseFloat(req.query.Qlongitude.toString()),
    };
  } else {
    return res.status(404).json({
      status: 0,
      message: "Invalid request query!",
    });
  }
  if (req.query.latitude !== undefined && req.query.longitude !== undefined) {
    coor = {
      latitude: parseFloat(req.query.latitude.toString()),
      longitude: parseFloat(req.query.longitude.toString()),
    };
  }
  else {
    return res.status(404).json({
      status: 0,
      message: "Invalid request query!",
    });
  }
  
  try {
    const key = process.env.DB_UPDATER_LTA_KEY;
    const url =
      "http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2";

    const resp = await axios.get(url, {
      headers: {
        accountKey: key,
      },
      params: {
        Lat: req.query.latitude,
        Long: req.query.longitude,
        Dist: 1,
      },
    });

    let result = resp.data.value;
    let respData: GetBicycleParkingType[] = [];

    const checker = result.find(
      (obj: {
        Latitude: number;
        Longitude: number;
        Description: string;
        RackType: string;
        RackCount: number;
        ShelterIndicator: "Y" | "N";
      }) =>
        obj.Description.toLowerCase() === name.toLowerCase() &&
        Math.abs(obj.Latitude - Qcoor.latitude) < 0.00000001 &&
        Math.abs(obj.Longitude - Qcoor.longitude) < 0.00000001
    );

    let parkingDetails: GetBicycleParkingType;

    if (checker === undefined) {
      return res.status(404).json({
        status: 0,
        message: "Bike park station not found!",
      });
    } else {
      parkingDetails = {
        type: "Bicycle",
        name: checker.Description,
        coordinate: {
          latitude: checker.Latitude,
          longitude: checker.Longitude,
        },
        rackType: checker.RackType,
        rackCount: checker.RackCount,
        shelterIndicator: checker.ShelterIndicator,
        distance: getDistance(coor, Qcoor),
      };
    }

    res.status(200).json({
      status: 1,
      message: "success",
      data: parkingDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
    });
  }
}
export default fetchBicycleParking;
