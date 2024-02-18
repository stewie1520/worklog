import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { Config } from "@/shared/config";
import { requireAuth } from "@/shared/middlewares";

import { EmployeeService } from "../ports/services/employee";

export const initEmployeeRoute = (
  employeeService: EmployeeService,
  config: Config,
) => {
  const route = new OpenAPIHono();

  route.openapi(
    createRoute({
      method: "post",
      tags: ["Employee"],
      path: "/sign-in",
      description: "Sign in user with email",
      request: {
        body: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                email: z.string().openapi({ example: "test@circel.xyz" }),
                password: z.string().openapi({ example: "password" }),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                token: z.string(),
              }),
            },
          },
          description: "Retrieve the user",
        },
        401: {
          content: {
            "application/json": {
              schema: z
                .object({
                  message: z.string(),
                })
                .openapi({
                  example: {
                    message: "Invalid credentials",
                  },
                }),
            },
          },
          description: "Invalid credentials",
        },
      },
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const result = await employeeService.signInWithPassword(email, password);

      if (result.ok) {
        return c.json(
          {
            token: result.data!.token,
          },
          200,
        );
      }

      return c.json(
        {
          message: result.message!,
        },
        401,
      );
    },
  );

  route.openapi(
    createRoute({
      method: "post",
      tags: ["Employee"],
      path: "/sign-up",
      description: "Sign up new user with email",
      request: {
        body: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                email: z.string().openapi({ example: "test@circel.xyz" }),
                password: z.string().openapi({ example: "password" }),
                name: z.string().openapi({ example: "test" }),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                token: z.string(),
              }),
            },
          },
          description: "Retrieve the user",
        },
        401: {
          content: {
            "application/json": {
              schema: z
                .object({
                  message: z.string(),
                })
                .openapi({
                  example: {
                    message: "Invalid credentials",
                  },
                }),
            },
          },
          description: "Invalid credentials",
        },
      },
    }),
    async (c) => {
      const { email, password, name } = c.req.valid("json");
      const result = await employeeService.signUpWithPassword(
        email,
        password,
        name,
      );

      if (result.ok) {
        return c.json(
          {
            token: result.data!.token,
          },
          200,
        );
      }

      return c.json(
        {
          message: result.message!,
        },
        401,
      );
    },
  );

  route.use(requireAuth(config));

  route.openapi(
    createRoute({
      security: [{ Bearer: [] }],
      method: "get",
      tags: ["Employee"],
      description: "Get private employee data",
      path: "/me",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                id: z.string().openapi({
                  example: "4e14a699-248b-493a-91a1-84bf86acb5e6",
                }),
                name: z.string().openapi({ example: "test" }),
                email: z.string().openapi({ example: "test@circel.xyz" }),
              }),
            },
          },
          description: "Retrieve the user",
        },
        500: {
          content: {
            "application/json": {
              schema: z
                .object({
                  message: z.string(),
                })
                .openapi({
                  example: {
                    message: "Invalid credentials",
                  },
                }),
            },
          },
          description: "Invalid credentials",
        },
      },
    }),
    async (c) => {
      const payload = c.get("jwtPayload");

      const result = await employeeService.getPrivateEmployeeData(payload.id);

      if (result.ok) {
        return c.json(
          {
            id: result.data!.id,
            name: result.data!.name,
            email: result.data!.email,
          },
          200,
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
      path: "/me/presign-pfp-url",
      method: "get",
      tags: ["Employee"],
      security: [{ Bearer: [] }],
      description: "Get presigned url for pfp upload",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.object({
                url: z.string(),
              }),
            },
          },
          description: "Presigned url",
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
      const payload = c.get("jwtPayload");

      const result = await employeeService.getPfpUploadUrl(payload.id);

      if (result.ok) {
        return c.json(
          {
            url: result.data!.url,
          },
          200,
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

  return route;
};
