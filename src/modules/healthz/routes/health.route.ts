import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { HealthService } from "../ports/services/health.service";

export const initHealthRoute = (healthService: HealthService) => {
  const route = new OpenAPIHono();

  route.openapi(
    createRoute({
      method: "get",
      tags: ["Healthz"],
      description: "Check liveness",
      path: "/live",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                ok: z.boolean(),
                message: z.string().optional(),
              }),
            },
          },
          description: "Status OK",
        },
      },
    }),
    async (c) => {
      const result = await healthService.checkLive();
      return c.json(result, 201);
    },
  );

  route.openapi(
    createRoute({
      method: "get",
      tags: ["Healthz"],
      description: "Check readiness",
      path: "/ready",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                ok: z.boolean(),
                message: z.string().optional(),
              }),
            },
          },
          description: "Status OK",
        },
      },
    }),
    async (c) => {
      const result = await healthService.checkReady();
      return c.json(result, 201);
    },
  );

  return route;
};
