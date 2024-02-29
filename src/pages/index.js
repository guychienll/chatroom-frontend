import * as userApi from "@/api/User";
import Auth from "@/components/Auth";
import Chat from "@/components/Chat";
import useUserStore from "@/stores/user";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const { profile, setProfile } = useUserStore((state) => state);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setProfile(await userApi.profile());
            } catch (e) {
                console.warn(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [setProfile]);

    if (loading) {
        return (
            <div className="grid min-h-screen place-items-center bg-slate-100">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="grid min-h-screen place-items-center bg-slate-100">
            {profile ? <Chat /> : <Auth />}
        </div>
    );
}
