const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = async (client, msg, args) => {
    if (!args[0]) {
        return msg.reply('Please provide a video name. Usage: !video <video_name>');
    }

    const videoName = args.join(' ');
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoName)}`;

    try {
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=VIDEO_ID`);
        const videoTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]/g, '');
        const videoPath = path.resolve(__dirname, `${videoTitle}.mp4`);

        msg.reply('Downloading the video...');

        ytdl(info.videoDetails.video_url, { quality: 'highest' })
            .pipe(fs.createWriteStream(videoPath))
            .on('finish', () => {
                msg.reply('Video download complete. Sending the file...');
                client.sendMessage(msg.from, fs.createReadStream(videoPath), {
                    sendMediaAsDocument: true,
                    filename: `${videoTitle}.mp4`
                });
            })
            .on('error', (err) => {
                console.error(err);
                msg.reply('Failed to download the video.');
            });

    } catch (error) {
        console.error(error);
        msg.reply('Error fetching video information.');
    }
};