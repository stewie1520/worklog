import { injectable } from "inversify";

import { Project } from "../../models/project.model";
import { ProjectRepository } from "../../ports/repositories/project.repository";

@injectable()
export class SequelizeProjectRepository extends ProjectRepository {
  async createProject(project: Project): Promise<void> {
    await project.save();
  }
}
