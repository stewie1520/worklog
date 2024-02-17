import { injectable } from "inversify";

import { IPaginationParams, PaginationResponse } from "@/types";

import { Company } from "../../models/company.model";
import { CompanyListData } from "../../ports/repositories/company.definition";
import { CompanyRepository } from "../../ports/repositories/company.repository";

@injectable()
export class SequelizeCompanyRepository extends CompanyRepository {
  public getCompanyById(id: string): Promise<Company | null> {
    return Company.findByPk(id);
  }

  public async create(company: Company): Promise<void> {
    await company.save();
  }

  public async listByUserId(
    userId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<CompanyListData>> {
    const [docs, total] = await Promise.all([
      Company.findAll({
        where: { ownerId: userId },
        limit: paginationParams.limit,
        offset: (paginationParams.page - 1) * paginationParams.limit,
        attributes: ["id", "name", "baseDomain"],
        order: [["createdAt", "DESC"]],
      }),
      Company.count({ where: { ownerId: userId } }),
    ]);

    return PaginationResponse.fromArray(docs, total, paginationParams);
  }
}
