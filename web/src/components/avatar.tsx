export default function Avatar({ seed }: { seed: string }) {
    return (
        <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
            alt="avatar"
        />
    );
}
