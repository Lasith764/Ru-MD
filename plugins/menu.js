module.exports = async (client, msg, args) => {
    const menuText = `
*Available Commands:*
 —————————>>

!menu 
!song <song_name> 
!video <video_name> 
    `;
    msg.reply(menuText);
};