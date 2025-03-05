import React, { useRef, useCallback } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

interface Track {
    id: number;
    url: string;
}

interface DragItem {
    id: number;
    index: number;
}

interface DraggableProps {
    track: Track;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    updateTrackUrl: (id: number, url: string) => void;
    removeTrack: (index: number) => void;
    index: number;
}

export const Draggable: React.FC<DraggableProps> = ({
    track,
    moveRow,
    updateTrackUrl,
    removeTrack,
    index,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        unknown,
        { handlerId: string | null }
    >({
        accept: 'track',
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId() as string | null,
        }),
        hover: (item: DragItem, monitor: DropTargetMonitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveRow(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag<
        DragItem,
        unknown,
        { isDragging: boolean }
    >({
        type: 'track',
        item: { id: track.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`space-y-3 ${isDragging ? 'opacity-50' : ''}`}
            data-handler-id={handlerId ?? undefined}
        >
            <div className='mb-3 rounded-md border border-[#d5c4a7] bg-[#f0e0c0] p-3 shadow-sm'>
                <div className='flex items-center gap-2'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#8b4513] text-xs font-bold text-white'>
                        {index + 1}
                    </div>
                    <div
                        className='relative flex-1'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type='text'
                            placeholder='Paste YouTube URL here'
                            className='w-full rounded-md border border-[#d5c4a7] bg-[#f5ead5] px-3 py-2 font-mono text-[#5d4037] placeholder-[#a1887f] focus:outline-none focus:ring-1 focus:ring-[#8b4513]'
                            value={track.url}
                            onChange={(e) =>
                                updateTrackUrl(track.id, e.target.value)
                            }
                        />
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTrack(index);
                        }}
                        className='text-[#8b4513] hover:text-[#5d4037]'
                        aria-label='Remove track'
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
                        >
                            <path d='M3 6h18'></path>
                            <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                            <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
