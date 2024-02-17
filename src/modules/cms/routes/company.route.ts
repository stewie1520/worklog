import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { Config } from "@/shared/config";
import { requireAuth } from "@/shared/middlewares";
import {
  paginationOutputSchema,
  paginationSchema,
} from "@/shared/validation/pagination";

import { CompanyService } from "../ports/services/company";

export const initCompanyRoute = (
  companyService: CompanyService,
  config: Config,
) => {
  const route = new OpenAPIHono();
  route.use(requireAuth(config));

  route.openapi(
    createRoute({
      method: "post",
      tags: ["Company"],
      description: "Create a new company",
      security: [{ bearerAuth: [] }],
      path: "/",
      request: {
        body: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                name: z.string(),
                baseDomain: z.string(),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: "Company created",
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
      const jwtPayload = c.get("jwtPayload");

      await companyService.create(jwtPayload.id, c.req.valid("json"));

      return c.json(undefined, 201);
    },
  );

  route.openapi(
    createRoute({
      method: "get",
      tags: ["Company"],
      description: "List companies",
      security: [{ bearerAuth: [] }],
      path: "/",
      request: {
        query: paginationSchema,
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: paginationOutputSchema,
            },
          },
          description: "List of companies",
        },
      },
    }),
    async (c) => {
      const jwtPayload = c.get("jwtPayload");

      const companies = await companyService.listByUser(jwtPayload.id, {
        limit: c.req.valid("query").limit,
        page: c.req.valid("query").page,
      });

      return c.json(companies, 200);
    },
  );

  return route;
};
