import { injectable } from "inversify";

import { Project } from "../../models/project.model";

@injectable()
export abstract class ProjectRepository {
  abstract createProject(project: Project): Promise<void>;
}
