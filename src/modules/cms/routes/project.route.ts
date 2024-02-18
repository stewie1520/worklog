import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { Config } from "@/shared/config";
import { requireAuth } from "@/shared/middlewares";
import {
  paginationOutputSchema,
  paginationSchema,
} from "@/shared/validation/pagination";

import { ProjectService } from "../ports/services/project";

export const initProjectRoute = (
  projectService: ProjectService,
  config: Config,
) => {
  const route = new OpenAPIHono();
  route.use(requireAuth(config));

  route.openapi(
    createRoute({
      method: "post",
      tags: ["Project"],
      description: "Create a new project",
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
          content: {
            "application/json": {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
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
        return c.json(
          {
            id: result.data!.id,
          },
          201,
        );
      }

      return c.json(
        {
          message: result.message!,
        },
        500,
      );
    },
  );

  route.openapi(
    createRoute({
      method: "get",
      tags: ["Project"],
      description: "List of projects",
      security: [{ Bearer: [] }],
      path: "/",
      request: {
        query: paginationSchema.extend({
          companyId: z.string().uuid(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: paginationOutputSchema.extend({
                data: z.array(
                  z.object({
                    id: z.string(),
                    name: z.string(),
                  }),
                ),
              }),
            },
          },
          description: "List of projects",
        },
      },
    }),
    async (c) => {
      const { companyId, ...paginationParams } = c.req.valid("query");

      const result = await projectService.listByCompany(
        companyId,
        paginationParams,
      );

      return c.json(result, 200);
    },
  );

  return route;
};
