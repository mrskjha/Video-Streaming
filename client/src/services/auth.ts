import { User } from "@/types";
import axios from "@/lib/axios";
import { SignInSchema } from "@/types/SignupType";
import z from "zod";

export const loginUser = async (
  payload: z.infer<typeof SignInSchema>
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const response = await axios.post("/users/login", payload);
  return response.data.message; // yahi me sab data hai
};



export const registerUser = async (payload: FormData): Promise<void> => {
  const response = await axios.post("/users/register", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.user;
};

export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Token not found in localStorage");
    return;
  }

  await axios.post(
    "/users/logout",
    {}, // No body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  localStorage.removeItem("token");
};
