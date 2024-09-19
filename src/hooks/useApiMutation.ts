import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  Configuration,
  GroupRestControllerApi,
  MessageRequestRestControllerApi,
  MessageRestControllerApi,
  ResponseError,
  UserRestControllerApi
} from "~/api";
import { useAuthorizationContext } from "~/components/AuthorizationContext.tsx";

export interface UseApiMutationOptions<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseMutationOptions<TData, ResponseError, TVariables, TContext>, "mutationFn"> {
  mutationFn: (configuration: Configuration,) => (variables: TVariables) => TData | Promise<TData>;
}

export function useApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(options: UseApiMutationOptions<TData, TVariables, TContext>) {
  const { getAccessToken } = useAuthorizationContext();

  return useMutation({
    ...options,
    mutationFn: async (variables) => {
      const configuration = new Configuration({
        basePath: "http://localhost:8080",
        accessToken: async () => (await getAccessToken())!,
      });
      return await options.mutationFn(configuration)(variables);
    },
  });
}

export interface UseGroupRestControllerApiMutationOptions<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseApiMutationOptions<TData, TVariables, TContext>, "mutationFn"> {
  mutationFn: (api: GroupRestControllerApi) => (variables: TVariables) => TData | Promise<TData>;
}

export function useGroupRestControllerApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseGroupRestControllerApiMutationOptions<
    TData,
    TVariables,
    TContext
  >,
) {
  return useApiMutation({
    ...options,
    mutationFn: (configuration) => {
      const api = new GroupRestControllerApi(configuration);
      return options.mutationFn(api);
    },
  });
}

export interface UseMessageRestControllerApiMutationOptions<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseApiMutationOptions<TData, TVariables, TContext>, "mutationFn"> {
  mutationFn: (api: MessageRestControllerApi) => (variables: TVariables) => TData | Promise<TData>;
}

export function useMessageRestControllerApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMessageRestControllerApiMutationOptions<
    TData,
    TVariables,
    TContext
  >,
) {
  return useApiMutation({
    ...options,
    mutationFn: (configuration) => {
      const api = new MessageRestControllerApi(configuration);
      return options.mutationFn(api);
    },
  });
}

export interface UseMessageRequestRestControllerApiMutationOptions<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseApiMutationOptions<TData, TVariables, TContext>, "mutationFn"> {
  mutationFn: (api: MessageRequestRestControllerApi) => (variables: TVariables) => TData | Promise<TData>;
}

export function useMessageRequestRestControllerApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMessageRequestRestControllerApiMutationOptions<
    TData,
    TVariables,
    TContext
  >,
) {
  return useApiMutation({
    ...options,
    mutationFn: (configuration) => {
      const api = new MessageRequestRestControllerApi(configuration);
      return options.mutationFn(api);
    },
  });
}

export interface UseUserRestControllerApiMutationOptions<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
> extends Omit<UseApiMutationOptions<TData, TVariables, TContext>, "mutationFn"> {
  mutationFn: (api: UserRestControllerApi) => (variables: TVariables) => TData | Promise<TData>;
}

export function useUserRestControllerApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseUserRestControllerApiMutationOptions<
    TData,
    TVariables,
    TContext
  >,
) {
  return useApiMutation({
    ...options,
    mutationFn: (configuration) => {
      const api = new UserRestControllerApi(configuration);
      return options.mutationFn(api);
    },
  });
}
