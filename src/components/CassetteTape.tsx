import React from 'react';

interface CassetteTapeProps {
    recipientName: string;
}

interface CassetteTapeRemixProps {
    recipientName: string;
    isEditing: boolean;
}

const CassetteTape: React.FC<CassetteTapeProps> = ({ recipientName }) => {
    return (
        <div className='mb-8 rotate-1 transform transition-transform duration-300 hover:rotate-0'>
            <div className='relative h-36 w-64 rounded-md border border-gray-800 bg-black shadow-lg'>
                <div className='absolute left-2 top-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute right-2 top-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute bottom-2 left-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute bottom-2 right-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute left-4 right-4 top-4 flex h-14 flex-col items-center justify-center rounded-sm border border-gray-300 bg-white'>
                    <div className='absolute top-1/3 h-px w-full bg-gray-300'></div>
                    <div className='absolute top-2/3 h-px w-full bg-gray-300'></div>
                    <div className='text-xl font-bold uppercase italic text-gray-800'>
                        {recipientName}
                    </div>
                </div>
                <div className='absolute left-0 right-0 top-20 flex h-8'>
                    <div className='h-full flex-1 bg-red-500'></div>
                    <div className='h-full flex-1 bg-pink-500'></div>
                    <div className='h-full flex-1 bg-yellow-500'></div>
                    <div className='h-full flex-1 bg-green-500'></div>
                    <div className='h-full flex-1 bg-blue-500'></div>
                    <div className='h-full flex-1 bg-indigo-500'></div>
                </div>
                <div className='absolute bottom-6 left-0 right-0 flex h-10 items-center justify-between px-8'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'>
                        <div className='h-6 w-6 rounded-full bg-gray-300'></div>
                    </div>
                    <div className='flex h-8 w-16 items-center justify-center rounded-sm border border-gray-700 bg-gray-800'>
                        <div className='h-4 w-12 rounded-sm bg-white'></div>
                    </div>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'>
                        <div className='h-6 w-6 rounded-full bg-gray-300'></div>
                    </div>
                </div>
                <div className='absolute bottom-2 left-6 border border-white bg-black px-1 text-xs font-bold text-white'>
                    A
                </div>
            </div>
            <div className='absolute -bottom-4 right-0 text-xs font-bold italic text-[#8b4513]'>
                Advay
            </div>
        </div>
    );
};

export const CassetteTapePlayer: React.FC<CassetteTapeProps> = ({
    recipientName,
}) => {
    return (
        <div className='relative h-36 w-64 rounded-md border border-gray-800 bg-black shadow-lg'>
            <div className='absolute left-2 top-2 h-3 w-3 rounded-full bg-white'></div>
            <div className='absolute right-2 top-2 h-3 w-3 rounded-full bg-white'></div>
            <div className='absolute bottom-2 left-2 h-3 w-3 rounded-full bg-white'></div>
            <div className='absolute bottom-2 right-2 h-3 w-3 rounded-full bg-white'></div>
            <div className='absolute left-4 right-4 top-4 flex h-14 flex-col items-center justify-center rounded-sm border border-gray-300 bg-white'>
                <div className='absolute top-1/3 h-px w-full bg-gray-300'></div>
                <div className='absolute top-2/3 h-px w-full bg-gray-300'></div>
                <div className='text-xl font-bold uppercase italic text-gray-800'>
                    {recipientName}
                </div>
            </div>
            <div className='absolute left-0 right-0 top-20 flex h-8'>
                {['red', 'pink', 'yellow', 'green', 'blue', 'indigo'].map(
                    (color, index) => (
                        <div
                            key={index}
                            className={`h-full flex-1 bg-${color}-500`}
                        ></div>
                    )
                )}
            </div>
            <div className='absolute bottom-6 left-0 right-0 flex h-10 items-center justify-between px-8'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'>
                    <div className='h-6 w-6 rounded-full bg-gray-300 '></div>
                </div>
                <div className='flex h-8 w-16 items-center justify-center rounded-sm border border-gray-700 bg-gray-800'>
                    <div className='h-4 w-12 rounded-sm bg-white'></div>
                </div>
                <div className='flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'>
                    <div className='h-6 w-6 rounded-full bg-gray-300 '></div>
                </div>
            </div>
            <div className='absolute bottom-2 left-6 border border-white bg-black px-1 text-xs font-bold text-white'>
                A
            </div>
        </div>
    );
};

export const CassetteTapeRemix: React.FC<CassetteTapeRemixProps> = ({
    recipientName,
    isEditing,
}) => {
    const animation = {
        animation: isEditing ? 'spin-slow 2s linear infinite' : '',
    };

    const rotateReel = `
        @keyframes spin-slow {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(rotateReel, styleSheet.cssRules.length);

    return (
        <div className='relative mb-8 rotate-1 transform transition-transform duration-300 hover:rotate-0'>
            <div className='relative h-36 w-64 rounded-md border border-gray-800 bg-black shadow-lg'>
                <div className='absolute left-2 top-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute right-2 top-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute bottom-2 left-2 h-3 w-3 rounded-full bg-white'></div>
                <div className='absolute bottom-2 right-2 h-3 w-3 rounded-full bg-white'></div>

                <div className='absolute left-4 right-4 top-4 flex h-14 flex-col items-center justify-center rounded-sm border border-gray-300 bg-white'>
                    <div className='absolute top-1/3 h-px w-full bg-gray-300'></div>
                    <div className='absolute top-2/3 h-px w-full bg-gray-300'></div>
                    <div className='text-xl font-bold uppercase italic text-gray-800'>
                        {recipientName}
                    </div>
                </div>

                <div className='absolute left-0 right-0 top-20 flex h-8'>
                    <div className='h-full flex-1 bg-red-500'></div>
                    <div className='h-full flex-1 bg-pink-500'></div>
                    <div className='h-full flex-1 bg-yellow-500'></div>
                    <div className='h-full flex-1 bg-green-500'></div>
                    <div className='h-full flex-1 bg-blue-500'></div>
                    <div className='h-full flex-1 bg-indigo-500'></div>
                </div>

                <div className='absolute bottom-6 left-0 right-0 flex h-10 items-center justify-between px-8'>
                    <div
                        style={animation}
                        className={
                            'flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'
                        }
                    >
                        <div className='h-6 w-6 rounded-full bg-gray-300'></div>
                        <div className='absolute h-6 w-6 rounded-full border-2 border-black'></div>
                        <span className='absolute -mt-1.5 text-xl font-bold text-black'>
                            |
                        </span>
                        <span className='absolute -mr-1.5 rotate-90 text-xl font-bold text-black'>
                            |
                        </span>
                    </div>

                    <div className='flex h-8 w-16 items-center justify-center rounded-sm border border-gray-700 bg-gray-800'>
                        <div className='h-4 w-12 rounded-sm bg-white'></div>
                    </div>

                    <div
                        style={animation}
                        className={
                            'flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-gray-200'
                        }
                    >
                        <div className='h-6 w-6 rounded-full bg-gray-300'></div>
                        <div className='absolute h-6 w-6 rounded-full border-2 border-black'></div>
                        <span className='absolute -mt-1.5 text-xl font-bold text-black'>
                            |
                        </span>
                        <span className='absolute -mr-1.5 rotate-90 text-xl font-bold text-black'>
                            |
                        </span>
                    </div>
                </div>

                <div className='absolute bottom-2 left-6 border border-white bg-black px-1 text-xs font-bold text-white'>
                    A
                </div>
            </div>
        </div>
    );
};

export default CassetteTape;
