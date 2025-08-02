import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <div className="glass absolute inset-0 m-20 mx-40">
            <h1>hello, world!</h1>
            <button className="glass glass-btn p-1">CLICK ME</button>
        </div>
    );
}
