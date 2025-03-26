'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/home');
        }
    }, [status]);

    return (
        <div>
            <div className='fixed top-0 shadow-white'>
                <div className="animate-[slide_5s_linear_infinite]">
                    <Image src="/rain.png" width={100} height={100} alt='sadman'/>
                </div>
            </div>
            <div className='fixed top-0 left-100 shadow-white'>
                <div className="animate-[slide_7s_linear_infinite]">
                    <Image src="/rain.png" width={100} height={100} alt='sadman'/>
                </div>
            </div>
            <div className='fixed top-0 left-200 shadow-white'>
                <div className="animate-[slide_4s_linear_infinite]">
                    <Image src="/rain.png" width={100} height={100} alt='sadman'/>
                </div>
            </div>
            <div className='fixed top-0 left-300 shadow-white'>
                <div className="animate-[slide_6s_linear_infinite]">
                    <Image src="/rain.png" width={100} height={100} alt='sadman'/>
                </div>
            </div>
            <div className='fixed top-200 left-200 shadow-white'>
                <div className="animate-[slide_5s_linear_infinite]">
                    <Image src="/rain-2.png" width={50} height={50} alt='sadman'/>
                </div>
            </div>
            <div className="-mt-16 flex flex-col items-center justify-center min-h-screen bg-[#070F2B]">
                <div className="flex flex-col items-center mb-8">
                    <Image src="/sadman.png" width={150} height={150} alt='sadman'/>
                    <h1 className="mt-4 text-3xl font-bold text-white">Ngao Ngao</h1>
                </div>
                <div className="w-full max-w-xs">
                    <button
                        onClick={() => signIn('google', undefined, {
                            prompt: 'select_account',
                        })}
                        className="w-full px-4 py-2 text-white bg-[#9290C3] rounded-md hover:opacity-50 transition cursor-pointer"
                    >
                        Login with Google
                    </button>
                </div>
                <style jsx>{`
                    @keyframes slide {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(1200px, 1200px);
                    }
                    }
                `}</style>    
            </div>
        </div>
    );
}
