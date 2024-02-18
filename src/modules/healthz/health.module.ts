import { ContainerModule } from "inversify";

import { DependencyLoader, ModuleActivator, RouteLoader } from "@/types";

import { HealthService } from "./ports/services/health.service";
import { initHealthRoute } from "./routes/health.route";

export const loadRoutes: RouteLoader = (app, container) => {
  const healthService = container.get(HealthService);
  app.route("healthz", initHealthRoute(healthService));
};

export const loadDependencies: DependencyLoader = () => {
  return new ContainerModule((bind) => {
    bind(HealthService).toSelf();
  });
};

export const activateModule: ModuleActivator = (app, container, config) => {
  container.load(loadDependencies(config));
  loadRoutes(app, container);
};

export default {
  activateModule,
};
