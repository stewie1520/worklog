import { randomUUID } from "crypto";
import { inject, injectable } from "inversify";

import { Project } from "../../../models/project.model";
import { CompanyRepository } from "../../repositories/company.repository";
import { ProjectRepository } from "../../repositories/project.repository";
import { CreateProjectParams } from "./project.definition";

@injectable()
export class ProjectService {
  constructor(
    @inject(ProjectRepository) private projectRepository: ProjectRepository,
    @inject(CompanyRepository) private companyRepository: CompanyRepository,
  ) {}

  public async createProject(
    currentUserId: string,
    params: CreateProjectParams,
  ) {
    const company = await this.companyRepository.getCompanyById(
      params.companyId,
    );

    if (!company || company.ownerId !== currentUserId) {
      return {
        ok: false,
        message: "Company not found",
      };
    }

    await this.projectRepository.createProject(
      new Project({
        id: params.id || randomUUID(),
        companyId: params.companyId,
        name: params.name,
      }),
    );

    return {
      ok: true,
      data: {
        id: params.id,
      },
    };
  }
}
