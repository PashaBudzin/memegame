import { Background } from "@/components/background";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            <TanStackRouterDevtools />
            <Background />
            <main className="absolute inset-0 z-20 ">
                <Outlet />
            </main>
        </>
    ),
});
