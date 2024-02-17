import { OpenAPIHono } from "@hono/zod-openapi";
import { ContainerModule } from "inversify";
import { Sequelize } from "sequelize";

import { Config } from "@/shared/config";

import { LoadOnlyContainer, ResolveOnlyContainer } from "./container";

export type ModuleActivator = (
  app: OpenAPIHono,
  container: ResolveOnlyContainer & LoadOnlyContainer,
  config: Config,
  db: Sequelize,
) => void;

export type DependencyLoader = (config: Config) => ContainerModule;

export type RouteLoader = (
  app: OpenAPIHono,
  container: ResolveOnlyContainer,
) => void;

export type ModelLoader = (db: Sequelize) => void;
