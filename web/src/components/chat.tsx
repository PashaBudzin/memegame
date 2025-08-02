import { SendHorizonal} from "lucide-react";
export default function Chat() {
    return (
        <div className="glass mt-4 flex h-full flex-col p-5">
            <div className="mt-auto ">
                <div className="glass flex min-h-8">
                    <input
                        className="glass-input w-5/6 rounded-l-[32px] p-1 px-2"
                        placeholder="Your message"
                    />
                    <button className="glass-btn border-only-right w-1/6 rounded-r-[32px] border-l-0 p-1 h-full">
                        <SendHorizonal className="mx-auto my-auto"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
