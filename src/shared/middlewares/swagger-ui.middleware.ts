import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

export const setupSwaggerUi = (apiV1: OpenAPIHono) => {
  apiV1.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
    in: "header",
  });

  apiV1.doc("/doc", {
    openapi: "3.0.0",
    servers: [{ url: "http://localhost:3000/api/v1", description: "Local" }],
    info: {
      version: "1.0.0",
      title: "Worklog API",
    },
  });

  apiV1.get("/swagger", swaggerUI({ url: "/api/v1/doc" }));
};
