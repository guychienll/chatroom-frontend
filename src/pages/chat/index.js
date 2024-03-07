import Chat from "@/components/Chat";
import Redirect from "@/components/Redirect";
import { withAuthGuard } from "../hocs/AuthGuard";

function ChatPage() {
    return (
        <div className="flex h-[calc(100dvh-4rem)] w-full items-center justify-center">
            <Chat />
        </div>
    );
}

export default withAuthGuard(ChatPage, () => <Redirect />);
