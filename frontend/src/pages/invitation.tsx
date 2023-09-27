import LoadingPage from '@/components/Util/Loading';
import { getCookie } from 'cookies-next';
import ky from 'ky';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function Invitation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jwt = getCookie("jwt");

    const key = searchParams.get("key");
    const type = searchParams.get("type");

    if (!type || !key) {
        router.push("/");
        return;
    }

    if (!jwt) {
        localStorage.set('invite', JSON.stringify({ type, key }));
        router.push("/");
        return;
    }

    const check = async () => {
        try {
            await ky.post(`${process.env.NEXT_PUBLIC_API}/user-management/addUserToUserGroupWithKey`, {
                json: { key: `${key}` },
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).json();
            router.push("/settings?tab=organizations")
        } catch (e) {
            if (e instanceof Error) {
                router.push("/");
            }
        }
    }

    if (jwt && key && type) {
        check();
    }

    return <LoadingPage />



}