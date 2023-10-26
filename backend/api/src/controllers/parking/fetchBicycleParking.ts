import { Request, Response } from "express";
import { ResponseType } from "@/types/response";
import axios from "axios";
import { getDistance } from "geolib";

type GetBicycleParkingType = {
  type: "Bicycle";
  Name: string;
  Latitude: number;
  Longitude: number;
  RackType: string;
  RackCount: number;
  ShelterIndicator: "Y" | "N";
  Distance?: number;
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
  const Qcoor: coordinate = {
    latitude: req.body.Qlatitude,
    longitude: req.body.Qlongitude,
  };
  const coor: coordinate = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };

  try {
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
        obj.Latitude === Qcoor.latitude &&
        obj.Longitude === Qcoor.longitude
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
        Name: checker.Description,
        Latitude: checker.Latitude,
        Longitude: checker.Longitude,
        RackType: checker.RackType,
        RackCount: checker.RackCount,
        ShelterIndicator: checker.ShelterIndicator,
        Distance: getDistance(coor, Qcoor),
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
