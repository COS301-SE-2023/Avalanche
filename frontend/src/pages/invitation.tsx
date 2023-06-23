import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import LoadingPage from '@/components/Util/Loading';
import { useEffect } from 'react';
import ky from 'ky';

export default function Invitation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jwt = getCookie("jwt");

    const key = searchParams.get("key");
    const group = searchParams.get("group");

    if (!group || !key) {
        router.push("/");
        return;
    }

    if (!jwt) {
        sessionStorage.set('invite', JSON.stringify({ group, key }));
        router.push("/");
        return;
    }

    const check = async () => {
        try {
            await ky.post(`http://localho.st/user-management/addUserToUserGroupWithKey`, {
                json: { key },
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

    useEffect(() => {
        if (jwt && key && group) {
            check();
        }
    }, [])

    return <LoadingPage />



}