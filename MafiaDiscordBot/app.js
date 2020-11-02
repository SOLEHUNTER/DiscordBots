const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    client.user.setActivity('Among Us Ready!'); //Set Activity Text
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Display Bot's Ping
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }

    //Display User's current voice channel
    if (command === "voice") {
        if (message.member.voice.channel) {
            message.channel.send("Current voice channel: " + message.member.voice.channel.name);
        } else {
            message.reply('You are not in voice channel!');
        }
    }

    //Mute all the members in the user's voice channel
    if (command === "m") {
        if (message.member.voice.channel) {
            let members = message.member.voice.channel.members;
            var membersarr = Array.from(members.first(members.size));
            if (members.size > 1) {
                var i;
                var msg = "Muted:";
                for (i = 0; i < members.size; i++) {
                    members.array()[i].voice.setMute(true, 'Imposter'); //Set mute true
                    if (members.size == i + 1) {
                        msg = msg + " " + membersarr[i].displayName + ".";
                    } else {
                        msg = msg + " " + membersarr[i].displayName + ",";
                    }
                }
                message.channel.send(msg);
            } else {
                message.channel.send(membersarr[0].displayName);
            }
        } else {
            message.reply('You are not in voice channel!');
        }
    }

    //Unmute all the members in the user's voice channel
    if (command === "u") {
        if (message.member.voice.channel) {
            let members = message.member.voice.channel.members;
            var membersarr = Array.from(members.first(members.size));
            if (members.size > 1) {
                var i;
                var msg = "Unmuted:";
                for (i = 0; i < members.size; i++) {
                    members.array()[i].voice.setMute(false, 'Crewmate'); //Set mute false
                    if (members.size == i + 1) {
                        msg = msg + " " + membersarr[i].displayName + ".";
                    } else {
                        msg = msg + " " + membersarr[i].displayName + ",";
                    }
                }
                message.channel.send(msg);
            } else {
                message.channel.send(membersarr[0].displayName);
            }
        } else {
            message.reply('You are not in voice channel!');
        }
    }

    //Mute the user
    if (command === "mute") {
        if (message.member.voice.channel) {
            message.member.voice.setMute(true, 'Imposter');
        } else {
            message.reply('You are not in voice channel!');
        }
    }

    //Unmute the user
    if (command === "unmute") {
        if (message.member.voice.channel) {
            message.member.voice.setMute(false, 'Crewmate');
        } else {
            message.reply('You are not in voice channel!');
        }
    }
});

client.login(config.token);