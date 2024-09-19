import {
  useAuthRestControllerApiSuspenseQuery,
  UseAuthRestControllerApiSuspenseQueryOptions
} from "~/hooks/useApiSuspenseQuery";
import { UserResponseDto } from "~/api";

export type UseGetAuthUserQueryOptions = Omit<UseAuthRestControllerApiSuspenseQueryOptions<UserResponseDto>, "queryKey" | "queryFn">;

export function useGetAuthUserSuspenseQuery(options?: UseGetAuthUserQueryOptions) {
  return useAuthRestControllerApiSuspenseQuery({
    queryKey: ["getAuthUser"],
    queryFn: async (api) => await api.getAuthUser(),
    ...options,
  });
}