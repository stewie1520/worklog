import { ContainerModule } from "inversify";

import { Config } from "@/shared/config";
import { DependencyLoader, ModuleActivator, RouteLoader } from "@/types";

import { SequelizeCompanyRepository } from "./adapters/repositories/sequelize-company.repository";
import { SequelizeEmployeeRepository } from "./adapters/repositories/sequelize-employee.repository";
import { SequelizeProjectRepository } from "./adapters/repositories/sequelize-project.repository";
import { loadModels } from "./models";
import { CompanyRepository } from "./ports/repositories/company.repository";
import { EmployeeRepository } from "./ports/repositories/employee.repository";
import { ProjectRepository } from "./ports/repositories/project.repository";
import { CompanyService } from "./ports/services/company";
import { EmployeeService } from "./ports/services/employee";
import { ProjectService } from "./ports/services/project";
import { initCompanyRoute } from "./routes/company.route";
import { initEmployeeRoute } from "./routes/employee.route";
import { initProjectRoute } from "./routes/project.route";

export const loadDependencies: DependencyLoader = () =>
  new ContainerModule((bind) => {
    // repositories
    bind(EmployeeRepository).to(SequelizeEmployeeRepository);
    bind(CompanyRepository).to(SequelizeCompanyRepository);
    bind(ProjectRepository).to(SequelizeProjectRepository);

    // services
    bind(EmployeeService).toSelf();
    bind(CompanyService).toSelf();
    bind(ProjectService).toSelf();
  });

export const loadRoutes: RouteLoader = (app, container) => {
  const config = container.get(Config);

  app.route(
    "employees",
    initEmployeeRoute(container.get(EmployeeService), config),
  );

  app.route(
    "companies",
    initCompanyRoute(container.get(CompanyService), config),
  );

  app.route(
    "projects",
    initProjectRoute(container.get(ProjectService), config),
  );
};

export const activateModule: ModuleActivator = (app, container, config, db) => {
  container.load(loadDependencies(config));
  loadRoutes(app, container);
  loadModels(db);
};

export default {
  activateModule,
};
