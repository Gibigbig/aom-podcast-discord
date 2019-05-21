const Discord = require('discord.js'),
    Parser = require('rss-parser'),
    parser = new Parser();


const allowed_role = "some role id here"


function play(playlist, connection) {
    var voiceChannel = connection.channel;

    if (playlist.length == 0) {
        voiceChannel.leave();
        return;
    }

    const dispatcher = connection.playStream(playlist[0])
        .on('end', () => {
            console.log('Music ended!');
            playlist.shift();
            play(playlist, connection);
        })
        .on('error', error => {
            console.error(error);
        });

}



exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    if (message.member.roles.find(async role => role.id === allowed_role)) {

        if (args.length > 0) {
            let playlist = [];
            let feed = await parser.parseURL(args[0]);
            const connection = message.guild.voiceConnection;
            if (connection) {
                await feed.items.forEach(item => {

                    let url = item.enclosure.url
                    playlist.push(url)

                });
                play(playlist, connection)
            } else {
                return message.reply("Not in a voice channel.")
            }

        } else {
            message.reply("No podcasts urls found.")
        }

    }
}
