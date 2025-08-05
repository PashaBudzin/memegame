import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Background } from "@/components/background";
import Devtools from "@/components/devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            <TanStackRouterDevtools />
            <Background />
            <Devtools />
            <main className="absolute inset-0 z-20">
                <Outlet />
            </main>
        </>
    ),
});
