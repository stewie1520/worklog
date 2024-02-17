import { injectable } from "inversify";

import { IPaginationParams, PaginationResponse } from "@/types";

import { Project } from "../../models/project.model";
import { ProjectListData } from "./project.definition";

@injectable()
export abstract class ProjectRepository {
  abstract createProject(project: Project): Promise<void>;
  abstract listByCompany(
    companyId: string,
    paginationParams: IPaginationParams,
  ): Promise<PaginationResponse<ProjectListData>>;
}
