const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports = async (client, msg, args) => {
    if (!args[0]) {
        return msg.reply('Please provide a song name. Usage: !song <song_name>');
    }

    const songName = args.join(' ');
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`;

    try {
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=VIDEO_ID`);
        const songTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]/g, '');
        const audioPath = path.resolve(__dirname, `${songTitle}.mp3`);

        msg.reply('Downloading the song...');

        const stream = ytdl(info.videoDetails.video_url, { filter: 'audioonly' });
        
        ffmpeg(stream)
            .audioBitrate(128)
            .save(audioPath)
            .on('end', async () => {
                msg.reply('Song download complete. Sending the file...');
                client.sendMessage(msg.from, fs.createReadStream(audioPath), {
                    sendMediaAsDocument: true,
                    filename: `${songTitle}.mp3`
                });
            })
            .on('error', (err) => {
                console.error(err);
                msg.reply('Failed to download the song.');
            });

    } catch (error) {
        console.error(error);
        msg.reply('Error fetching song information. :(');
    }
};