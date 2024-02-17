import { injectable } from "inversify";

import { IPaginationParams, PaginationResponse } from "@/types";

import { Company } from "../../models/company.model";
import { CompanyListData } from "./company.definition";

@injectable()
export abstract class CompanyRepository {
  public abstract create(company: Company): Promise<void>;
  public abstract getCompanyById(id: string): Promise<Company | null>;
  public abstract listByUserId(
    userId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<CompanyListData>>;
}
