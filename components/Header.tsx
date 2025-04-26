import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';

const Header = async () => {
    const isUserAuthenticated = await isAuthenticated();

    return (
        <>
            <div className='w-full flex flex-col items-center justify-between space-y-5'>
                <h1 className='text-3xl md:text-5xl font-semibold text-center'>Practice. Perform. Prevail.</h1>
                <p className='w-3/5 text-gray-400 text-center'>Your ultimate interview prep companion — mock interviews, real-time feedback, and personalized insights to help you land your dream job all with the help of AI.</p>
                <p className='text-[12px]'>Ready to take a step?</p>
                {!isUserAuthenticated ? (
                    <Link href="/sign-in" className="bg-blue-800 hover:bg-blue-600 transition-colors ease-in-out duration-500 px-4 py-2 rounded-lg">Lets Begin your Journey!</Link>
                ) : (
                    <Link href="/interview" className="bg-blue-800 hover:bg-blue-600 transition-colors ease-in-out duration-500 px-4 py-2 rounded-lg">Start Unfolding!</Link>
                )}
            </div>
            <p className='hidden md:block w-full text-center mt-[80px]'>Powered by technologies like</p>
            <div className="hidden md:flex w-full justify-between">
                <Image
                    src="/gemini.gif"
                    width={80}
                    height={80}
                    alt="gemini"
                />
                <Image
                    src="/firebase.png"
                    width={140}
                    height={80}
                    alt="firebase"
                />
                <Image
                    src="/next.png"
                    width={80}
                    height={80}
                    alt="nextjs"
                />
                <Image
                    src="/tailwind.png"
                    width={160}
                    height={60}
                    alt="vapi"
                />
                <Image
                    src="/vapi.png"
                    width={80}
                    height={60}
                    alt="vapi"
                />
                <Image
                    src="/typescript.png"
                    width={160}
                    height={60}
                    alt="typescript"
                />
            </div>
            <div className="flex flex-col items-center justify-between space-y-10 mt-14">
                <div className="flex flex-col space-y-1 items-center">
                    <span className='bg-green-300 text-black px-3 py-1 text-[10px] uppercase rounded-full'>PrepView for a better preperation of Interview</span>
                    <h3 className='text-xl md:text-[40px] font-semibold text-center'>Practice to grab your next big opportunity!</h3>
                </div>
            </div>
            <div className="flex flex-col items-center mt-10">
                <div className="flex flex-col justify-between w-full md:flex-row">
                    <div className="w-full md:w-[32%] bg-stone-900 border min-h-[220px] border-stone-500 p-4 rounded-xl flex flex-col justify-around space-y-5">
                        <div className="flex flex-col items-start space-y-2">
                            <h2 className="text-5xl py-4">💬 </h2>
                            <h1 className="text-3xl">Mock Interviews</h1>
                        </div>
                        <p className=''>Simulate real interviews with role-specific questions and timed responses. Build confidence and polish your communication.</p>
                    </div>
                    <div className="w-full md:w-[32%] bg-stone-900 border min-h-[220px] border-stone-500 p-4 rounded-xl flex flex-col justify-around space-y-5">
                        <div className="flex flex-col items-start space-y-2">
                            <h2 className="text-5xl py-4">📊 </h2>
                            <h1 className="text-3xl">Smart Feedback</h1>
                        </div>
                        <p className=''>AI-driven feedback on your answers, tone, clarity, and content. Get personalized tips to improve after every session.</p>
                    </div>
                    <div className="w-full md:w-[32%] bg-stone-900 border min-h-[220px] border-stone-500 p-4 rounded-xl flex flex-col justify-around space-y-5">
                        <div className="flex flex-col items-start space-y-2">
                            <h2 className="text-5xl py-4">🎯 </h2>
                            <h1 className="text-3xl">Custom Prep</h1>
                        </div>
                        <p className=''>Tailored prep tracks for your dream job or domain. Whether it's tech, management, or HR — we've got you covered.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

// New Footer Component
const Footer = () => {
    return (
        <footer className="w-full bg-gray-800 text-white text-center py-2">
            <p className="text-sm">© 2023 Your Company. All rights reserved.</p>
        </footer>
    );
}

export default Header
