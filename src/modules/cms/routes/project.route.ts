import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { Config } from "@/shared/config";
import { requireAuth } from "@/shared/middlewares";

import { ProjectService } from "../ports/services/project";

export const initProjectRoute = (
  projectService: ProjectService,
  config: Config,
) => {
  const route = new OpenAPIHono();
  route.use(requireAuth(config));

  // Create new project
  route.openapi(
    createRoute({
      method: "post",
      tags: ["Project"],
      security: [{ Bearer: [] }],
      path: "/",
      request: {
        body: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                name: z.string(),
                companyId: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: "Project created",
        },
        500: {
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      const { name, companyId } = c.req.valid("json");
      const user = c.get("jwtPayload");

      const result = await projectService.createProject(user.id, {
        name,
        companyId,
      });

      if (result.ok) {
        return c.json(result.data, 201);
      }

      return c.json(result, 500);
    },
  );

  return route;
};
