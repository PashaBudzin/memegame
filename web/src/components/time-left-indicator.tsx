export default function TimeLeftIndicator({
    totalTime,
    timeLeft,
}: {
    totalTime: number;
    timeLeft: number;
}) {
    const timePercentage = Math.max(timeLeft / totalTime, 0);
    const sliceAngle = (1 - timePercentage) * 360;

    return (
        <div
            className="fixed top-10 left-10 h-10 w-10 rounded-full border-2 border-gray-300 shadow-lg transition-all duration-500 ease-in-out"
            style={{
                background: `conic-gradient(transparent 0deg ${sliceAngle}deg, #00b65f ${sliceAngle}deg 360deg)`,
            }}
        />
    );
}
