import { prisma } from "@/data/prisma";
import BaseRepository from "./BaseRepository";
import { Vehicle } from "@prisma/client";

export default class VehicleRepository extends BaseRepository<Vehicle> {
  constructor() {
    super(prisma.vehicle);
  }

  getAllByUserId(userId: string): Promise<Vehicle[]> {
    return this.getAll({
      where: {
        userId,
      },
    });
  }
}
