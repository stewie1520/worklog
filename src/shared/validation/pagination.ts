import { z } from "zod";

export const paginationSchema = z.object({
  page: z.string().pipe(z.coerce.number().min(1)).default("1"),
  limit: z.string().pipe(z.coerce.number().min(10).max(100)).default("20"),
});

export const paginationOutputSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  data: z.array(z.any()),
});
