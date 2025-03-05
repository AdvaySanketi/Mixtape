import MixtapeCreator from './components/MixtapeCreator';

function CreateMixtape() {
    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center bg-[#f0e6d2] p-6'>
            <MixtapeCreator />
            <footer className='mt-6 text-center font-mono text-xs text-[#8b4513]'>
                © 2025 Advay Sanketi • ALL RIGHTS RESERVED
            </footer>
        </div>
    );
}

export default CreateMixtape;
