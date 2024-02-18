import "reflect-metadata";

import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Container } from "inversify";
import { Sequelize } from "sequelize";

import { connectDatabase } from "./database/connect";
import cmsModule from "./modules/cms/cms.module";
import healthModule from "./modules/healthz/health.module";
import { Config, loadConfig } from "./shared/config";
import { createLogger, Logger } from "./shared/logger";
import { addMiddlewares, setupSwaggerUi } from "./shared/middlewares";
import { sharedServicesLoader } from "./shared/services/shared-services.module";

const main = async () => {
  const config = await loadConfig();
  const logger = createLogger(config);
  const db = await connectDatabase(config, logger);

  const container = new Container();
  container.bind(Config).toConstantValue(config);
  container.bind(Sequelize).toConstantValue(db);
  container.bind(Logger).toConstantValue(logger);
  container.load(sharedServicesLoader(config));

  const app = new OpenAPIHono();

  const api = app.basePath("/api/v1");
  addMiddlewares(api, config);

  cmsModule.activateModule(api, container, config, db);
  healthModule.activateModule(api, container, config, db);

  setupSwaggerUi(api);

  const port = 3000;
  logger.info(`Server is running on port ${port}`);

  serve({
    fetch: api.fetch,
    port,
  });
};

void main();
