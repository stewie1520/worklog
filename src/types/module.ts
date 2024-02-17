import { OpenAPIHono } from "@hono/zod-openapi";
import { ContainerModule } from "inversify";
import { Sequelize } from "sequelize";

import { Config } from "@/shared/config";

import { LoadOnlyContainer, ResolveOnlyContainer } from "./container";

export type DependencyRegistry = (config: Config) => ContainerModule;

export type ModuleActivator = (
  app: OpenAPIHono,
  container: ResolveOnlyContainer & LoadOnlyContainer,
  config: Config,
  db: Sequelize,
) => void;
