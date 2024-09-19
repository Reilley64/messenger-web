import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from "@tanstack/react-query";
import {
  AuthRestControllerApi,
  Configuration, GroupRestControllerApi, MessageRequestRestControllerApi,
  MessageRestControllerApi,
  ResponseError,
  UserRestControllerApi
} from "~/api";
import { useAuthorizationContext } from "~/components/AuthorizationContext";

export interface UseApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<UseSuspenseQueryOptions<TQueryFnData, ResponseError, TData, TQueryKey>, "queryFn"> {
  queryFn: (configuration: Configuration,) => TQueryFnData | Promise<TQueryFnData>;
}

export function useApiSuspenseQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  options: UseApiSuspenseQueryOptions<TQueryFnData, TData>,
) {
  const { getAccessToken } = useAuthorizationContext();

  return useSuspenseQuery({
    ...options,
    queryFn: async () => {
      const configuration = new Configuration({
        accessToken: async () => (await getAccessToken())!,
      });
      return await options.queryFn(configuration);
    },
  });
}

export interface UseAuthRestControllerApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiSuspenseQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: AuthRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useAuthRestControllerApiSuspenseQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseAuthRestControllerApiSuspenseQueryOptions<TQueryFnData, TData>) {
  return useApiSuspenseQuery({
    ...options,
    queryKey: ["AuthRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new AuthRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseGroupRestControllerApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiSuspenseQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: GroupRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useGroupRestControllerApiSuspenseQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseGroupRestControllerApiSuspenseQueryOptions<TQueryFnData, TData>) {
  return useApiSuspenseQuery({
    ...options,
    queryKey: ["GroupRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new GroupRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseMessageRestControllerApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiSuspenseQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: MessageRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useMessageRestControllerApiSuspenseQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseMessageRestControllerApiSuspenseQueryOptions<TQueryFnData, TData>) {
  return useApiSuspenseQuery({
    ...options,
    queryKey: ["MessageRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new MessageRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseMessageRequestRestControllerApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiSuspenseQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: MessageRequestRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useMessageRequestRestControllerApiSuspenseQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseMessageRequestRestControllerApiSuspenseQueryOptions<TQueryFnData, TData>) {
  return useApiSuspenseQuery({
    ...options,
    queryKey: ["MessageRequestRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new MessageRequestRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}

export interface UseUserRestControllerApiSuspenseQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
> extends Omit<UseApiSuspenseQueryOptions<TQueryFnData, TData>, "queryFn"> {
  queryFn: (api: UserRestControllerApi) => TQueryFnData | Promise<TQueryFnData>;
}

export function useUserRestControllerApiSuspenseQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
>(options: UseUserRestControllerApiSuspenseQueryOptions<TQueryFnData, TData>) {
  return useApiSuspenseQuery({
    ...options,
    queryKey: ["UserRestControllerApi", ...options.queryKey],
    queryFn: async (configuration) => {
      const api = new UserRestControllerApi(configuration);
      return await options.queryFn(api);
    },
  });
}