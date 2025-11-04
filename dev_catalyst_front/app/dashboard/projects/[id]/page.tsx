'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectRedirect() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const id = params?.id;
        if (id) {
            router.replace(`/dashboard/${id}`);
        } else {
            router.replace('/dashboard');
        }
    }, [router, params]);

    return null;
}
