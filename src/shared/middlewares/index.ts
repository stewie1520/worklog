import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger as loggerMiddleware } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { Config } from "../config";

export const addMiddlewares = (app: Hono, config: Config) => {
  app.use(
    ...(config.isDev || config.isTest ? [loggerMiddleware()] : []),
    prettyJSON(),
    secureHeaders(),
  );

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json({ message: "Internal server error" }, 500);
  });
};

export * from "./jwt.middleware";
export * from "./swagger-ui.middleware";
