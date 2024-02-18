import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

import { Logger } from "@/shared/logger";
import { IPaginationParams, PaginationResponse } from "@/types";

import { Project } from "../../../models";
import { CompanyRepository } from "../../repositories/company.repository";
import { ProjectRepository } from "../../repositories/project.repository";
import { CreateProjectParams, ProjectListResponse } from "./project.definition";

@injectable()
export class ProjectService {
  constructor(
    @inject(ProjectRepository) private projectRepository: ProjectRepository,
    @inject(CompanyRepository) private companyRepository: CompanyRepository,
    @inject(Logger) private logger: Logger,
  ) {}

  public async createProject(
    currentUserId: string,
    params: CreateProjectParams,
  ) {
    try {
      const company = await this.companyRepository.getCompanyById(
        params.companyId,
      );

      if (!company || company.ownerId !== currentUserId) {
        return {
          ok: false,
          message: "Company not found",
        };
      }

      const projectId = params.id || randomUUID();

      await this.projectRepository.createProject(
        new Project({
          id: projectId,
          companyId: params.companyId,
          name: params.name,
        }),
      );

      return {
        ok: true,
        data: {
          id: projectId,
        },
      };
    } catch (err) {
      this.logger.error(err);

      return {
        ok: false,
        message: (err as Error).message || "Error creating project",
      };
    }
  }

  public async listByCompany(
    companyId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<ProjectListResponse>> {
    try {
      return await this.projectRepository.listByCompany(
        companyId,
        paginationParams,
      );
    } catch (err) {
      this.logger.error(err);
      return PaginationResponse.fromArray([], 0, paginationParams);
    }
  }
}
