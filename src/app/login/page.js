'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push('/home');
        }
    }, [session, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
            <div className="flex flex-col items-center mb-8">
                <img
                    id="logo"
                    src="https://images-ext-1.discordapp.net/external/Z31aSkayvpvjwB6bFQtkXZ-uI3yDCSQvS4wP5oJkPFs/%3Fstp%3Ddst-jpg_s150x150_tt6%26_nc_ht%3Dinstagram.fbkk29-5.fna.fbcdn.net%26_nc_cat%3D107%26_nc_oc%3DQ6cZ2AH89mLc-56DPbEKd_KBrO4YN720TQ3Pib55TeJb0vIRbLCIWSTJ6VlO6xHs9K4gKis%26_nc_ohc%3DxdfCIk1yMyYQ7kNvgEAnLYQ%26_nc_gid%3Da18e1d3afb3f429fb11c2bb9dede9b8b%26edm%3DALGbJPMBAAAA%26ccb%3D7-5%26oh%3D00_AYGmQDD2l-fd19dcuGfI5FHiylLinehupevQboDCReyp0g%26oe%3D67D0775F%26_nc_sid%3D7d3ac5/https/instagram.fbkk29-5.fna.fbcdn.net/v/t51.2885-19/481962430_2236658440062271_6808717357687971919_n.jpg?format=webp&width=169&height=169"
                    alt="Logo"
                    className="w-32 h-32 rounded-full"
                />
                <h1 className="mt-4 text-3xl font-bold text-gray-800">Ngao Ngao</h1>
            </div>
            <div className="w-full max-w-xs">
                <button
                    onClick={() => signIn('google')}
                    className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >
                    Login with Google
                </button>
            </div>
        </div>
    );
}
