import { jwt } from "hono/jwt";

export const requireAuth = (config: { JWT_SECRET: string }) => {
  return jwt({ secret: config.JWT_SECRET });
};
