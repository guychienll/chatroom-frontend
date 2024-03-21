import Chat from "@/components/Chat";
import Redirect from "@/components/Redirect";
import { withAuthGuard } from "@/hocs/AuthGuard";

function ChatPage() {
    return (
        <div className="ml-auto mr-auto flex h-[calc(100dvh-4rem)] max-w-[1296px]">
            <Chat />
        </div>
    );
}

export default withAuthGuard(ChatPage, () => <Redirect />);
