import { useLocation } from "@tanstack/react-router";

const COLS = 10;
const ROWS = 6;

type TriangleProps = {
    delay: number;
    color: string;
};

function hashStringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function shiftHslHue(hsl: string, shift: number): string {
    const match = hsl.match(/hsl\(\s*(\d+),\s*([\d.]+)%?,\s*([\d.]+)%?\s*\)/i);
    if (!match) throw new Error("Invalid HSL format");

    const [_, h, s, l] = match;
    const hue = (parseInt(h) + shift) % 360;
    const sat = parseFloat(s);
    const light = parseFloat(l);

    return `hsl(${(hue + 360) % 360}, ${sat}%, ${light}%)`;
}

export const Triangle = ({ delay, color }: TriangleProps) => (
    <polygon points="" fill="none" stroke={color} strokeWidth={5}>
        <animate
            attributeName="points"
            repeatCount="indefinite"
            dur="4s"
            begin={`${delay}s`}
            from="50 57.5, 50 57.5, 50 57.5"
            to="50 -75, 175 126, -75 126"
        />
    </polygon>
);

export const Shape = () => {
    const location = useLocation();

    const colors = [
        "hsl(320,100%,70%)",
        "hsl(240,100%,70%)",
        "hsl(160,100%,70%)",
        "hsl(80,100%,70%)",
    ].map((el) => shiftHslHue(el, hashStringToNumber(location.href)));

    return (
        <svg
            className="shape-mask h-[230px] w-[200px]"
            viewBox="0 0 100 115"
            preserveAspectRatio="xMidYMin slice"
        >
            <Triangle delay={0} color={colors[0]} />
            <Triangle delay={1} color={colors[1]} />
            <Triangle delay={2} color={colors[2]} />
            <Triangle delay={3} color={colors[3]} />
        </svg>
    );
};

export const Background = () => {
    const location = useLocation();

    const total = COLS * ROWS;
    const bg = shiftHslHue(
        "hsl(262, 71%, 48%)",
        hashStringToNumber(location.href),
    );

    return (
        <div
            className={`relative h-screen w-screen overflow-hidden transition-all`}
            style={{ backgroundColor: bg }}
        >
            {/* Overlay gradient */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_0%,rgba(98,35,210,0.85)_100%)]" />

            {/* Hex Grid Container */}
            <div
                className="z-0 grid"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, 200px)`,
                    gridTemplateRows: `repeat(${ROWS}, 230px)`,
                    transform: "translate(-3%, -4%)",
                }}
            >
                {[...Array(total)].map((_, i) => {
                    let translate = "";
                    if (i >= COLS * 5) translate = "translate(-50%, -125%)";
                    else if (i >= COLS * 4) translate = "translate(0%, -100%)";
                    else if (i >= COLS * 3) translate = "translate(-50%, -75%)";
                    else if (i >= COLS * 2) translate = "translate(0%, -50%)";
                    else if (i >= COLS * 1) translate = "translate(-50%, -25%)";

                    return (
                        <div
                            key={i}
                            className="shape-wrapper"
                            style={{ transform: translate }}
                        >
                            <Shape />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
