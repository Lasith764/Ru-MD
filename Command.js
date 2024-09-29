const plugins = {
    alive: require('./plugins/alive'),
    menu: require('./plugins/menu'),
    song: require('./plugins/song'),
    video: require('./plugins/video')
};

function handleCommand(client, msg) {
    const args = msg.body.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (plugins[command]) {
        plugins[command](client, msg, args);
    } else {
        msg.reply('Unknown command. Try !menu for help.');
    }
}

module.exports = { handleCommand };