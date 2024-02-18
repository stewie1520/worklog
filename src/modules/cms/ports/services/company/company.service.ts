import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

import { Logger } from "@/shared/logger";
import { IPaginationParams, PaginationResponse } from "@/types";

import { Company } from "../../../models";
import { CompanyRepository } from "../../repositories/company.repository";
import { CompanyListResponse, CreateCompanyParams } from "./company.definition";

@injectable()
export class CompanyService {
  constructor(
    @inject(CompanyRepository) private companyRepository: CompanyRepository,
    @inject(Logger) private logger: Logger,
  ) {}

  public async create(currentUserId: string, params: CreateCompanyParams) {
    try {
      const toCreateCompany = new Company({
        id: params.id || randomUUID(),
        ownerId: currentUserId,
        name: params.name,
        baseDomain: params.baseDomain,
      });

      await this.companyRepository.create(toCreateCompany);

      return {
        ok: true,
        data: {
          id: toCreateCompany.id,
        },
      };
    } catch (err) {
      return {
        ok: false,
        message: (err as Error).message || "Error creating company",
      };
    }
  }

  public async listByUser(
    userId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<CompanyListResponse>> {
    try {
      return await this.companyRepository.listByUserId(
        userId,
        paginationParams,
      );
    } catch (error) {
      this.logger.error(error);

      return PaginationResponse.fromArray([], 0, paginationParams);
    }
  }
}
