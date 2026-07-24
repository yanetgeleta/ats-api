import { z } from 'zod';

export const ParsedResumeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
});

export type ParsedResumeData = z.infer<typeof ParsedResumeSchema>;
