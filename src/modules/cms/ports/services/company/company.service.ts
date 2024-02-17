import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

import { IPaginationParams, PaginationResponse } from "@/types";

import { Company } from "../../../models/company.model";
import { CompanyRepository } from "../../repositories/company.repository";
import { CompanyListResponse, CreateCompanyParams } from "./company.definition";

@injectable()
export class CompanyService {
  constructor(
    @inject(CompanyRepository) private companyRepository: CompanyRepository,
  ) {}

  public async create(
    currentUserId: string,
    params: CreateCompanyParams,
  ): Promise<void> {
    const toCreateCompany = new Company({
      id: params.id || randomUUID(),
      ownerId: currentUserId,
      name: params.name,
      baseDomain: params.baseDomain,
    });

    await this.companyRepository.create(toCreateCompany);
  }

  public async listByUser(
    userId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<CompanyListResponse>> {
    return this.companyRepository.listByUserId(userId, paginationParams);
  }
}
