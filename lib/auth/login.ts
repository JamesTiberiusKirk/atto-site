import { getLoginRequest, updateUserLogin } from "lib/db/login";
import type { LoginRequest } from "types/loginRequests";

export async function login(token: string): Promise<[LoginRequest?, Error?]> {
  console.log("Login attempt with: ", token);

  const res = await getLoginRequest(token);
  if (res.error) {
    console.error("Error quering db", res.error);
    return [undefined, res.error as Error];
  }
  if (!res.data) {
    console.error("No valid login found");
    return [undefined, res.error as Error];
  }

  const toggleRes = await updateUserLogin(res.data);
  if (toggleRes.error) {
    console.error("Error quering db for toggle", toggleRes.error);
    return [undefined, toggleRes.error as Error];
  }

  console.log("Found valid login request: ", res.data);
  return [res.data, undefined];
}
