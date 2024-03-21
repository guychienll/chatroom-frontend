import ProfileEditor from "@/components/Chat/ProfileEditor";
import Redirect from "@/components/Redirect";
import { withAuthGuard } from "@/hocs/AuthGuard";

function ProfilePage() {
    return (
        <div className="ml-auto mr-auto flex min-h-[calc(100dvh-4rem)] max-w-[1296px] items-center justify-center">
            <ProfileEditor />
        </div>
    );
}

export default withAuthGuard(ProfilePage, () => <Redirect />);
