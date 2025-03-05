import { Helmet } from 'react-helmet-async';
import CassettePlayer from './components/CassettePlayer';

function Player() {
    // const shareUrl = window.location.href;

    const generateCassettePreview = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Cassette outline
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 5;
            ctx.strokeRect(100, 100, 600, 400);

            // Text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';

            // Creator name
            ctx.font = '30px Arial';
            ctx.fillText(`Advay's Mixtape`, 400, 350);
        }

        return canvas.toDataURL('image/png');
    };

    const previewImage = generateCassettePreview();

    return (
        <div>
            {/* Open Graph Meta Tags */}
            <Helmet>
                <meta property='og:title' content={`Advay's Mixtape`} />
                <meta property='og:description' content={`Advay's Mixtape`} />
                <meta property='og:type' content='music.playlist' />
                <meta property='og:url' content={window.location.href} />
                <meta property='og:image' content={previewImage} />
                <meta property='og:image:width' content='800' />
                <meta property='og:image:height' content='600' />

                {/* Twitter Card Tags */}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={`Advay's Mixtape`} />
                <meta name='twitter:description' content={`Advay's Mixtape`} />
                <meta name='twitter:image' content={previewImage} />
            </Helmet>

            <div className='relative flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] p-6'>
                <div className='absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30'></div>
                <div className='pointer-events-none fixed left-0 top-0 opacity-0'></div>
                <CassettePlayer />
            </div>
        </div>
    );
}

export default Player;
