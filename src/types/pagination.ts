import { z } from "zod";

import { paginationSchema } from "@/shared/validation/pagination";

export interface IPaginationParams extends z.infer<typeof paginationSchema> {}

export class PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
  }

  public static fromArray<T>(
    data: T[],
    total: number,
    paginationParams: IPaginationParams,
  ): PaginationResponse<T> {
    return new PaginationResponse<T>(
      data,
      total,
      paginationParams.page,
      paginationParams.limit,
    );
  }

  toJSON() {
    return {
      data: this.data,
      total: this.total,
      page: this.page,
      limit: this.limit,
      totalPages: this.totalPages,
      hasNext: this.hasNext,
    };
  }
}
