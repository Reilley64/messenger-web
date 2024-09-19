import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  AuthRestControllerApi,
  Configuration,
  MessageRestControllerApi,
  ResponseError,
  UserRestControllerApi
} from "~/api";
import { useAuthorizationContext } from "~/components/AuthorizationContext";

export interface UseApiQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<UseQueryOptions<TQueryFnData, ResponseError, TData, TQueryKey>, "queryFn"> {
  queryFn: (configuration: Configuration,) => TQueryFnData | Promise<TQueryFnData>;
}

export function useApiQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  options: UseApiQueryOptions<TQueryFnData, TData>,
) {
  const { getAccessToken } = useAuthorizationContext();

  return useQuery({
    ...options,
    queryFn: async () => {
      const configuration = new Configuration({
        accessToken: async () => (await getAccessToken())!,
      });
      return await options.queryFn(configuration);
    },
  });
}

export interface UseAuthRestControllerApiQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: AuthRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useAuthRestControllerApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseAuthRestControllerApiQueryOptions<TQueryFnData, TData>) {
  return useApiQuery({
    ...options,
    queryKey: ["AuthRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new AuthRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseUserRestControllerApiQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: UserRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useUserRestControllerApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseUserRestControllerApiQueryOptions<TQueryFnData, TData>) {
  return useApiQuery({
    ...options,
    queryKey: ["UserRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new UserRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseMessageRestControllerApiQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: MessageRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useMessageRestControllerApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseMessageRestControllerApiQueryOptions<TQueryFnData, TData>) {
  return useApiQuery({
    ...options,
    queryKey: ["MessageRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new MessageRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}