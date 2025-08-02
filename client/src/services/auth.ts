import { LoginPayload, User } from "@/types";
import axios from "@/lib/axios";

export const loginUser = async (payload: LoginPayload): Promise<User> => {
  const response = await axios.post("/api/login", payload);
  return response.data.user;
};
