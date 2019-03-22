import { Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma.ts";


@Injectable()
export class PrismaService {
  public prisma: Prisma;
  constructor() {
    this.prisma = new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: true
    });
  }
}
