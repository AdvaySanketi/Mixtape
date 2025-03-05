import React, { useState, useRef, useEffect } from 'react';
import { CassetteTapePlayer } from './CassetteTape';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import MixtapeService from '../services/mixtapeService';
import { Toaster, toast } from 'sonner';
/// <reference types="youtube" />

interface Track {
    id: number;
    url: string;
    videoID: string;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: typeof YT;
    }
}

const CassettePlayer: React.FC = () => {
    const { id } = useParams();
    const [recipientName, setRecipientName] = useState<string>('');
    const [urls, setUrls] = useState<Track[]>([
        { id: 1, url: '', videoID: '' },
    ]);
    const [tracks, setTracks] = useState<Track[]>([
        { id: 1, url: '', videoID: '' },
    ]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasTape, setHasTape] = useState(false);
    const [awesomeMix, setAwesomeMix] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(1);
    const [isCassetteInserted, setIsCassetteInserted] = useState(false);
    const playerRef = useRef(null);
    const youtubePlayer = useRef<YT.Player | null>(null);
    const insertAudioRef = useRef<HTMLAudioElement | null>(null);
    const ejectAudioRef = useRef<HTMLAudioElement | null>(null);
    const buttonAudioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMixtape = async () => {
            try {
                if (!id) return;

                const mixtape = await MixtapeService.getMixtapeById(id);

                if (mixtape?.id != id) {
                    toast(
                        'The mixtape you sought is missing, so here’s a cassette of our own creation — just for you!'
                    );
                    setAwesomeMix(true);
                }

                setRecipientName(mixtape?.recipientName || 'FOR YOU');
                setUrls(
                    mixtape?.tracks.map((track) => ({
                        ...track,
                        videoID: '',
                    })) || []
                );
            } catch (e) {
                console.error('Error fetching mixtape', e);
            }
        };

        if (id) {
            fetchMixtape();
        }
    }, [id]);

    useEffect(() => {
        const extractYoutubeIds = (trackList: Track[]): Track[] => {
            return trackList
                .map(({ id, url }) => {
                    if (typeof url !== 'string' || !url.trim()) return null;
                    let videoId: string | null = null;

                    try {
                        if (url.includes('youtube.com/watch')) {
                            const urlObj = new URL(url);
                            videoId = urlObj.searchParams.get('v');
                        } else if (url.includes('youtu.be/')) {
                            videoId =
                                url.split('youtu.be/')[1]?.split('?')[0] ||
                                null;
                        } else if (url.includes('youtube.com/shorts/')) {
                            videoId =
                                url
                                    .split('youtube.com/shorts/')[1]
                                    ?.split('?')[0] || null;
                        }
                    } catch (error) {
                        console.error('Invalid URL:', url, error);
                    }

                    return videoId
                        ? {
                              id,
                              url: `https://www.youtube.com/watch?v=${videoId}`,
                              videoID: videoId,
                          }
                        : null;
                })
                .filter((track): track is Track => !!track);
        };

        const extractedTracks = extractYoutubeIds(urls);
        setTracks(extractedTracks);
    }, [urls]);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

        const playerElement = document.getElementById(
            'youtube-player'
        ) as HTMLElement | null;

        if (playerElement) {
            window.onYouTubeIframeAPIReady = () => {
                youtubePlayer.current = new window.YT.Player('youtube-player', {
                    height: '0',
                    width: '0',
                    videoId: tracks[currentTrack - 1]?.videoID || '',
                    playerVars: {
                        playsinline: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                    },
                    events: {
                        onStateChange: onPlayerStateChange,
                        onReady: (event) => {
                            youtubePlayer.current = event.target;
                            if (isPlaying) {
                                event.target.playVideo();
                            }
                        },
                    },
                });
            };
        }

        return () => {
            if (
                youtubePlayer.current &&
                typeof youtubePlayer.current.destroy === 'function'
            ) {
                youtubePlayer.current.destroy();
                youtubePlayer.current = null;
            }
        };
    }, []);

    const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            if (currentTrack < tracks.length) {
                setCurrentTrack(currentTrack + 1);
            } else {
                setIsPlaying(false);
            }
        }
    };

    useEffect(() => {
        if (
            !youtubePlayer.current ||
            typeof youtubePlayer.current.loadVideoById !== 'function'
        )
            return;

        youtubePlayer.current.loadVideoById(
            tracks[currentTrack - 1]?.videoID || ''
        );
        if (isPlaying) {
            youtubePlayer.current.playVideo();
        } else {
            youtubePlayer.current.pauseVideo();
        }
    }, [currentTrack, isPlaying]);

    const handleInsert = () => {
        setIsCassetteInserted(true);

        if (insertAudioRef.current) {
            insertAudioRef.current.currentTime = 0;
            insertAudioRef.current.play();
        }

        setTimeout(() => {
            setHasTape(true);
        }, 1000);
    };

    const handleEject = () => {
        setIsCassetteInserted(false);
        if (isPlaying) {
            setIsPlaying(false);
        }

        if (ejectAudioRef.current) {
            ejectAudioRef.current.currentTime = 0;
            ejectAudioRef.current.play();
        }

        setTimeout(() => {
            setHasTape(false);
        }, 1000);
    };

    const handleButtonClick = () => {
        if (buttonAudioRef.current) {
            buttonAudioRef.current.currentTime = 0;
            buttonAudioRef.current.play();
        }
    };

    const buttonStyle = {
        animation: isCassetteInserted
            ? 'none'
            : 'glowInsert 3s ease-in-out infinite',
    };

    const flashInsertKeyframes = `
        @keyframes glowInsert {
            0% { 
                background-color: #d5c4a7; 
                color: '#3a4151';
                box-shadow: none;
            }
            50% { 
                background-color: #e6d5b8; 
                color: '#3a4151';
                box-shadow: 0 0 2px 1px #d2c5a6B3;
            }
            100% { 
                background-color: #d5c4a7; 
                color: '#3a4151';
                box-shadow: none;
            }
        }
    `;

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(flashInsertKeyframes, styleSheet.cssRules.length);

    return (
        <div className='relative z-[3] mt-12 w-full max-w-md font-[Poppins]'>
            <Toaster
                position='top-center'
                toastOptions={{
                    style: {
                        background: '#d5c4a7',
                        fontSize: '14px',
                        padding: '20px',
                    },
                }}
            />
            <audio
                ref={insertAudioRef}
                src='/audio/insert.mp3'
                preload='auto'
            ></audio>
            <audio
                ref={ejectAudioRef}
                src='/audio/eject.mp3'
                preload='auto'
            ></audio>
            <audio
                ref={buttonAudioRef}
                src='/audio/button.mp3'
                preload='auto'
            ></audio>
            <div className='absolute left-1/2 top-0 z-10 h-14 w-full -translate-x-1/2 -translate-y-10 transform'>
                <div className='absolute left-0 top-8 h-6 w-10 rounded-b-lg border-2 border-[#c4b396] bg-[#d5c4a7] shadow-md'></div>
                <div className='absolute right-0 top-8 h-6 w-10 rounded-b-lg border-2 border-[#c4b396] bg-[#d5c4a7] shadow-md'></div>
                <div className='absolute left-4 top-0 h-10 w-5 rounded-t-lg border-2 border-[#d5c4a7] bg-[#e6d5b8] shadow-inner'></div>
                <div className='absolute right-4 top-0 h-10 w-5 rounded-t-lg border-2 border-[#d5c4a7] bg-[#e6d5b8] shadow-inner'></div>
                <div className='absolute left-1/2 top-0 flex h-5 w-[calc(100%-40px)] -translate-x-1/2 transform items-center justify-center rounded-full border border-[#5d4037] bg-[#8b4513] shadow-md'>
                    <div className='h-2 w-[95%] rounded-full bg-[#a1887f] opacity-70'></div>
                </div>
                <div className='absolute left-1/2 top-0 flex h-5 w-[calc(100%-50px)] -translate-x-1/2 transform items-center justify-between px-2'>
                    {[...Array(15)].map((_, index) => (
                        <div
                            key={index}
                            className='h-3 w-0.5 rounded-full bg-[#5d4037] opacity-30'
                        ></div>
                    ))}
                </div>
                <div className='absolute left-1/2 top-1 h-1 w-[calc(100%-60px)] -translate-x-1/2 transform rounded-full bg-[#5d4037] opacity-20 blur-sm'></div>
            </div>
            <div className='rounded-lg border border-[#e6d5b8] bg-[#f5e7c9] p-5 shadow-xl'>
                <div className='relative my-4 h-10 w-full overflow-hidden rounded-md border border-[#e6d5b8] bg-[#f0e0c0]'>
                    <div className='absolute top-1/2 h-1 w-full -translate-y-1/2 transform bg-gray-400'></div>
                    <div className='absolute top-1 flex w-full justify-between px-4 text-[8px] text-gray-600'>
                        <span>88</span>
                        <span>92</span>
                        <span>96</span>
                        <span>100</span>
                        <span>104</span>
                        <span>108</span>
                        <span>MHz</span>
                    </div>
                    <div className='absolute left-[40px] top-1 h-8 w-1 -translate-y-1/2 transform bg-red-500'></div>
                    <div className='absolute left-[42px] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-[#c4b396] bg-[#d5c4a7]'></div>
                </div>
                <div className='relative mb-4 h-[200px] w-full overflow-hidden rounded-md border border-[#d5c4a7] bg-[#e6d5b8]'>
                    <div
                        id='youtube-player'
                        ref={playerRef}
                        style={{ display: 'none' }}
                    ></div>
                    <div className='absolute left-0 right-0 top-0 h-2 bg-[#d5c4a7]'></div>
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 transform transition-all duration-1000 ease-in-out ${
                            isCassetteInserted ? 'top-4' : '-top-40'
                        }`}
                    >
                        <CassetteTapePlayer recipientName={recipientName} />
                    </div>
                    <button
                        style={buttonStyle}
                        className='absolute bottom-2 right-2 rounded border border-[#c4b396] bg-[#d5c4a7] px-2 py-1 text-xs text-gray-700 transition hover:bg-[#e6d5b8]'
                        onClick={
                            isCassetteInserted ? handleEject : handleInsert
                        }
                    >
                        {isCassetteInserted ? 'EJECT' : 'INSERT'}
                    </button>
                </div>
                <div className='relative mb-4 grid h-16 w-full grid-cols-10 gap-1 overflow-hidden rounded-md border border-[#d5c4a7] bg-[#e6d5b8] p-2'>
                    {Array.from({ length: 40 }).map((_, index) => (
                        <div
                            key={index}
                            className='h-full w-full rounded-full bg-[#d5c4a7]'
                        ></div>
                    ))}
                </div>
                <div className='mb-4 flex w-full items-center justify-between rounded border border-[#d5c4a7] bg-[#e6d5b8] p-2'>
                    <div className='font-mono text-sm text-gray-700'>
                        {hasTape
                            ? `TRACK ${currentTrack}/${tracks.length}`
                            : 'NO TAPE'}
                    </div>
                    <div
                        className={`h-3 w-3 rounded-full ${
                            hasTape ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    ></div>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='flex space-x-3'>
                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-[#c4b396] bg-[#d5c4a7] text-gray-700 transition hover:bg-[#e6d5b8] disabled:opacity-50'
                            aria-label='Previous track'
                            disabled={!isCassetteInserted || currentTrack === 1}
                            onClick={() => {
                                handleButtonClick();
                                setCurrentTrack(currentTrack - 1);
                            }}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                ></path>
                            </svg>
                        </button>
                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-[#c4b396] bg-[#d5c4a7] text-gray-700 transition hover:bg-[#e6d5b8] disabled:opacity-50'
                            aria-label='Play'
                            onClick={() => {
                                handleButtonClick();
                                setIsPlaying(!isPlaying);
                            }}
                            disabled={!isCassetteInserted}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                {isPlaying ? (
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    ></path>
                                ) : (
                                    <>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                                        ></path>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                        ></path>
                                    </>
                                )}
                            </svg>
                        </button>
                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-[#c4b396] bg-[#d5c4a7] text-gray-700 transition hover:bg-[#e6d5b8] disabled:opacity-50'
                            aria-label='Next track'
                            disabled={
                                !isCassetteInserted ||
                                currentTrack === tracks.length
                            }
                            onClick={() => {
                                handleButtonClick();
                                setCurrentTrack(currentTrack + 1);
                            }}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M13 5l7 7-7 7M5 5l7 7-7 7'
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <div className='relative h-8 w-8 rounded-full border border-[#c4b396] bg-[#d5c4a7]'>
                            <div className='absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#c4b396]'></div>
                            <div className='absolute left-1/2 top-1/2 h-2 w-1 -translate-x-1/2 -translate-y-1 -translate-y-1/2 transform bg-gray-700'></div>
                        </div>

                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-[#c4b396] bg-[#d5c4a7] text-gray-700 transition hover:bg-[#e6d5b8] disabled:opacity-50'
                            onClick={() =>
                                navigate(`/remix/${id}`, {
                                    state: { recipientName, tracks },
                                })
                            }
                            disabled={!isCassetteInserted || awesomeMix}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <polyline points='16 3 21 3 21 8'></polyline>
                                <line x1='4' y1='20' x2='21' y2='3'></line>
                                <polyline points='21 16 21 21 16 21'></polyline>
                                <line x1='15' y1='15' x2='21' y2='21'></line>
                                <line x1='4' y1='4' x2='9' y2='9'></line>
                            </svg>
                        </button>

                        <button
                            className='flex h-8 w-8 items-center justify-center rounded-full border border-[#c4b396] bg-[#d5c4a7] text-gray-700 transition hover:bg-[#e6d5b8] disabled:opacity-50'
                            onClick={() =>
                                window.open(
                                    `https://www.youtube.com/watch?v=${
                                        tracks[currentTrack - 1]?.videoID
                                    }`,
                                    '_blank'
                                )
                            }
                            disabled={!isCassetteInserted}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <path d='M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.41 4 12 4 12 4s-6.41 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.59 20 12 20 12 20s6.41 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z'></path>
                                <polygon points='9.75 15.02 15.5 12 9.75 8.98 9.75 15.02'></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-4 text-center'>
                <p className='mb-2 text-[10px] text-gray-500'>
                    Note: On mobile devices, you may need to press pause and
                    play when skipping tracks.
                </p>
                <a
                    href='/'
                    className='text-sm text-gray-700 underline transition hover:text-gray-600'
                >
                    Create a new mixtape
                </a>
            </div>
        </div>
    );
};

export default CassettePlayer;
