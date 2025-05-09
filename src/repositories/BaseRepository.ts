import { type PrismaClient } from "@prisma/client/extension";

const DEFAULT_ORDER_BY = {
  createdAt: "desc",
};

const MAX_RECORDS_LIMIT = 100;

export default abstract class BaseRepository<T> {
  constructor(protected modelClient: PrismaClient) {}

  protected getYTDDateRange() {
    const now = new Date(Date.now());
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st
    return {
      gte: startOfYear,
      lte: now,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(options: Record<string, any> = {}): Promise<Array<T>> {
    if (!options.orderBy) {
      options.orderBy = DEFAULT_ORDER_BY;
    }
    if (!options.take || options.take > MAX_RECORDS_LIMIT) {
      options.take = MAX_RECORDS_LIMIT;
    }
    return this.modelClient.findMany(options);
  }

  getById(id: string): Promise<T> {
    return this.modelClient.findUnique({
      where: {
        id,
      },
    });
  }

  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    return this.modelClient.create({
      data,
    });
  }

  delete(id: string): Promise<T> {
    return this.modelClient.delete({
      where: {
        id,
      },
    });
  }

  update(
    id: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<T> {
    return this.modelClient.update({
      where: {
        id,
      },
      data,
    });
  }
  deleteAll(): Promise<T> {
    return this.modelClient.deleteMany({});
  }
}
