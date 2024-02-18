import { injectable } from "inversify";

import { IPaginationParams, PaginationResponse } from "@/types";

import { Project } from "../../models";
import { ProjectListData } from "../../ports/repositories/project.definition";
import { ProjectRepository } from "../../ports/repositories/project.repository";

@injectable()
export class SequelizeProjectRepository extends ProjectRepository {
  async listByCompany(
    companyId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<ProjectListData>> {
    const [docs, total] = await Promise.all([
      Project.findAll({
        where: { companyId },
        limit: paginationParams.limit,
        offset: (paginationParams.page - 1) * paginationParams.limit,
        attributes: ["id", "name"],
        order: [["createdAt", "DESC"]],
      }),
      Project.count({ where: { companyId } }),
    ]);

    return PaginationResponse.fromArray(docs, total, paginationParams);
  }

  async createProject(project: Project): Promise<void> {
    await project.save();
  }
}
