import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    enabled: Boolean(localStorage.getItem("authToken")),
  });
}
