import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthorizationContextProvider from "~/components/AuthorizationContext";
import AuthUserContextProvider from "~/components/AuthUserContext.tsx";
import PrivateKeyContextProvider from "~/components/PrivateKeyContext.tsx";

export const Route = createRootRoute({
  component: () => <Root />,
});

function Root() {
  return (
    <AuthorizationContextProvider>
      <AuthUserContextProvider>
        <PrivateKeyContextProvider>
          <Outlet />
        </PrivateKeyContextProvider>
      </AuthUserContextProvider>
    </AuthorizationContextProvider>
  );
}
