import {
  useAuthRestControllerApiQuery,
  UseAuthRestControllerApiQueryOptions
} from "~/hooks/useApiQuery";
import { User } from "~/api";

export type UseGetAuthUserQueryOptions = Omit<UseAuthRestControllerApiQueryOptions<User>, "queryKey" | "queryFn">;

export function useGetAuthUserQuery(options?: UseGetAuthUserQueryOptions) {
  return useAuthRestControllerApiQuery({
    queryKey: ["getAuthUser"],
    queryFn: async (api) => await api.getAuthUser(),
    ...options,
  });
}