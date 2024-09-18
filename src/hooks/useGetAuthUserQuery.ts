import {
  useAuthRestControllerApiQuery,
  UseAuthRestControllerApiQueryOptions
} from "~/hooks/useApiQuery";
import { UserResponseDto } from "~/api";

export type UseGetAuthUserQueryOptions = Omit<UseAuthRestControllerApiQueryOptions<UserResponseDto>, "queryKey" | "queryFn">;

export function useGetAuthUserQuery(options?: UseGetAuthUserQueryOptions) {
  return useAuthRestControllerApiQuery({
    queryKey: ["getAuthUser"],
    queryFn: async (api) => await api.getAuthUser(),
    ...options,
  });
}