import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CassetteTapeRemix } from './CassetteTape';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Draggable } from './draggable';
import update from 'immutability-helper';
import { useParams } from 'react-router-dom';
import MixtapeService from '../services/mixtapeService';

interface Track {
    id: number;
    url: string;
}

interface Mixtape {
    recipientName: string;
    tracks: Track[];
}

interface MixtapeEditorProps {
    currentMixtape: Mixtape;
}

const MixtapeEditor: React.FC<MixtapeEditorProps> = ({ currentMixtape }) => {
    const { id } = useParams();
    const [recipientName, setRecipientName] = useState<string>(
        currentMixtape?.recipientName || ''
    );
    const [mixtape, setMixtape] = useState<Mixtape>(currentMixtape);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const remixAudioRef = useRef(null);

    const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
        setIsEditing(true);
        setMixtape((prevMixtape) =>
            update(prevMixtape, {
                tracks: {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevMixtape.tracks[dragIndex]],
                    ],
                },
            })
        );
        if (remixAudioRef.current) {
            remixAudioRef.current.currentTime = 0;
            remixAudioRef.current.play();
        }
        setTimeout(() => setIsEditing(false), 2000);
    }, []);

    const removeTrack = (index: number) => {
        setIsEditing(true);
        const updatedTracks = [...mixtape.tracks];
        updatedTracks.splice(index, 1);
        setMixtape({ ...mixtape, tracks: updatedTracks });
        if (remixAudioRef.current) {
            remixAudioRef.current.currentTime = 0;
            remixAudioRef.current.play();
        }
        setTimeout(() => setIsEditing(false), 2000);
    };

    const addTrack = () => {
        setIsEditing(true);
        if (mixtape.tracks.length < 5) {
            setMixtape({
                ...mixtape,
                tracks: [...mixtape.tracks, { id: Date.now(), url: '' }],
            });
        }
        if (remixAudioRef.current) {
            remixAudioRef.current.currentTime = 0;
            remixAudioRef.current.play();
        }
        setTimeout(() => setIsEditing(false), 2000);
    };

    const updateTrackUrl = (id: number, url: string) => {
        setIsEditing(true);
        setMixtape({
            ...mixtape,
            tracks: mixtape.tracks.map((track) =>
                track.id === id ? { ...track, url } : track
            ),
        });
        if (remixAudioRef.current) {
            remixAudioRef.current.currentTime = 0;
            remixAudioRef.current.play();
        }
        setTimeout(() => setIsEditing(false), 2000);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mixtape.tracks.some((track) => !track.url.trim())) {
            alert('Please fill in URLs for all tracks or remove empty ones.');
            return;
        }

        try {
            if (!id) return;

            const updatedMixtape = { ...mixtape, recipientName };
            const updated = await MixtapeService.updateMixtape(
                id,
                updatedMixtape
            );

            navigate(`/playback/${id}`);
        } catch (error) {
            console.error('Failed to create mixtape', error);
        }
    };

    return (
        <div className='relative z-[3] flex w-full max-w-md flex-col items-center'>
            <audio
                ref={remixAudioRef}
                src='/audio/remix.mp3'
                preload='auto'
            ></audio>
            <h1 className='mb-6 font-custom text-3xl font-bold text-[#8b4513]'>
                Remix Your Mixtape
            </h1>

            <CassetteTapeRemix
                recipientName={recipientName || 'FOR YOU'}
                isEditing={isEditing}
            />

            <div className='relative w-full rounded-lg border bg-[#e6d5b8] p-6 shadow-md'>
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
                    <div className='flex items-center justify-between'>
                        <label className='mb-1 block text-sm font-bold text-[#8b4513]'>
                            YOUR TRACKS:
                        </label>
                        <span className='text-xs text-[#8b4513]'>
                            Drag to reorder
                        </span>
                    </div>

                    <DndProvider backend={HTML5Backend}>
                        <div className='space-y-3'>
                            {mixtape.tracks.map((track, index) => (
                                <Draggable
                                    key={track.id}
                                    index={index}
                                    track={track}
                                    moveRow={moveRow}
                                    removeTrack={removeTrack}
                                    updateTrackUrl={updateTrackUrl}
                                />
                            ))}
                        </div>
                    </DndProvider>

                    {mixtape.tracks.length < 5 && (
                        <button
                            onClick={addTrack}
                            className='flex w-full items-center justify-center rounded-md border border-[#c4b396] bg-[#d5c4a7] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#5d4037] transition hover:bg-[#e6d5b8]'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='mr-2'
                            >
                                <circle cx='12' cy='12' r='10'></circle>
                                <line x1='12' y1='8' x2='12' y2='16'></line>
                                <line x1='8' y1='12' x2='16' y2='12'></line>
                            </svg>
                            ADD TRACK ({mixtape.tracks.length}/5)
                        </button>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className='flex w-full transform items-center justify-center rounded-md bg-[#8b4513] px-4 py-3 font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#7d3f11]'
                >
                    Remix
                    <div className='pl-1'></div>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='ml-2'
                    >
                        <polyline points='16 3 21 3 21 8'></polyline>
                        <line x1='4' y1='20' x2='21' y2='3'></line>
                        <polyline points='21 16 21 21 16 21'></polyline>
                        <line x1='15' y1='15' x2='21' y2='21'></line>
                        <line x1='4' y1='4' x2='9' y2='9'></line>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MixtapeEditor;
