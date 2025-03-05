import React from 'react';
import { useLocation } from 'react-router-dom';
import MixtapeEditor from './components/MixtapeEditor';

const EditMixtape: React.FC = () => {
    const location = useLocation();
    const recipientName = location.state?.recipientName;
    const tracks = location.state?.tracks;

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] p-6'>
            <div className='absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30'></div>
            <div className='pointer-events-none fixed left-0 top-0 opacity-0'></div>
            <MixtapeEditor currentMixtape={{ recipientName, tracks }} />
            <footer className='mt-4 text-center font-mono text-xs text-[#8b4513]'>
                © 2025 Advay Sanketi • ALL RIGHTS RESERVED
            </footer>
        </div>
    );
};

export default EditMixtape;
