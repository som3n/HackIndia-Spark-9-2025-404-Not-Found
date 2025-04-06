import Image from 'next/image'
import React from 'react'
import classNames from 'classnames'

enum CallStatus{
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface AgentProps {
    userName: string;
}

const Agent = ({ userName }: AgentProps) => {
    const isSpeaking = true;
    const callStatus: CallStatus = CallStatus.FINISHED;
    const messages = [
        "What's your name",
        "My name is Somen, nice to meat you!"
    ];
    const lastMessage = messages[messages.length -1];
    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src="/ai-avatar.png" alt='vapi' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak' />}
                    </div>
                    <h3>Your AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user-avatar.png' alt='User Avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 &&(
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={lastMessage} className={classNames('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className='w-full flex justify-center'>
                {callStatus === CallStatus.CONNECTING ? null : (
                    callStatus !== CallStatus.ACTIVE ? (
                        <button className={classNames('relative btn-call', { 'hidden': callStatus === CallStatus.CONNECTING })}>
                            <span className="absolute animate-ping rounded-full opacity-75"/>
                            <span>
                                {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : '...'}
                            </span>
                        </button>
                    ) : (
                        <button className='bth-disconnect'>END</button>
                    )
                )}
            </div>
        </>
    )
}

export default Agent
