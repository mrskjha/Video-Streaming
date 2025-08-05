import z, { email } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  fullname: z.string().min(2).max(100),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Avatar is required" }),
  coverImg: z.instanceof(File).optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
})