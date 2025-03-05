import React, { useState } from 'react';
import CassetteTape from './CassetteTape';
import { useNavigate } from 'react-router-dom';
import MixtapeService from '../services/mixtapeService';

interface Track {
    id: number;
    url: string;
}

const MixtapeCreator: React.FC = () => {
    const [recipientName, setRecipientName] = useState<string>('');
    const [tracks, setTracks] = useState<Track[]>([{ id: 1, url: '' }]);
    const navigate = useNavigate();

    const addTrack = () => {
        if (tracks.length < 5) {
            setTracks([...tracks, { id: tracks.length + 1, url: '' }]);
        }
    };

    const updateTrackUrl = (id: number, url: string) => {
        setTracks(
            tracks.map((track) => (track.id === id ? { ...track, url } : track))
        );
    };

    const handleCreateMixtape = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const createdMixtape = await MixtapeService.createMixtape({
                recipientName: recipientName || 'FOR YOU',
                tracks: tracks,
            });

            navigate(`/playback/${createdMixtape.id}`);
        } catch (error) {
            console.error('Failed to create mixtape', error);
        }
    };

    return (
        <div className='relative z-[3] flex w-full max-w-md flex-col items-center'>
            <h1 className='mb-6 font-custom text-3xl font-bold tracking-wide text-[#8b4513]'>
                Make a Mixtape
            </h1>

            <CassetteTape recipientName={recipientName || 'FOR YOU'} />

            <div className='relative w-full rounded-lg border border-[#d5c4a7] bg-[#e6d5b8] p-6 shadow-md'>
                <div className='mb-4'>
                    <label className='mb-1 block text-sm font-bold text-[#8b4513]'>
                        PERSONALIZE YOUR MIXTAPE:
                    </label>
                    <input
                        type='text'
                        placeholder='Who is this mixtape for?'
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className='w-full rounded-md border border-[#d5c4a7] bg-[#f0e0c0] px-3 py-2 font-mono text-[#5d4037] placeholder-[#a1887f] focus:outline-none focus:ring-1 focus:ring-[#8b4513]'
                        maxLength={15}
                    />
                    <p className='mt-1 text-xs italic text-[#8b4513]'>
                        This will appear on the cassette label
                        <br />
                        Leave blank for "For You"
                    </p>
                </div>

                <div className='mb-4 space-y-3'>
                    <label className='mb-1 block text-sm font-bold uppercase tracking-wide text-[#8b4513]'>
                        ADD YOUTUBE LINKS (MAX 5):
                    </label>

                    {tracks.map((track, index) => (
                        <div key={track.id} className='mb-3'>
                            <div className='flex items-center gap-2'>
                                <div className='relative flex-1'>
                                    <div className='absolute left-3 top-1/2 w-5 -translate-y-1/2 transform text-right text-sm font-bold text-[#8b4513]'>
                                        {index + 1}:
                                    </div>
                                    <input
                                        type='text'
                                        name='youtubeUrl'
                                        placeholder='Paste YouTube URL here'
                                        className='w-full rounded-md border border-[#d5c4a7] bg-[#f0e0c0] py-2 pl-10 pr-3 font-mono text-[#5d4037] placeholder-[#a1887f] focus:outline-none focus:ring-1 focus:ring-[#8b4513]'
                                        value={track.url}
                                        onChange={(e) =>
                                            updateTrackUrl(
                                                track.id,
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {tracks.length < 5 && (
                        <button
                            onClick={addTrack}
                            className='w-full rounded-md border border-[#c4b396] bg-[#d5c4a7] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#5d4037] transition hover:bg-[#e6d5b8]'
                        >
                            ADD ANOTHER TRACK ({tracks.length}/5)
                        </button>
                    )}
                </div>

                <button
                    onClick={handleCreateMixtape}
                    className='flex w-full transform items-center justify-center rounded-md bg-[#8b4513] px-4 py-3 font-bold uppercase tracking-wide text-white shadow-md'
                >
                    CREATE MIXTAPE
                    <div className='pl-2'></div>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='2'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        class='lucide lucide-circle-play'
                    >
                        <circle cx='12' cy='12' r='10' />
                        <polygon points='10 8 16 12 10 16 10 8' />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MixtapeCreator;
