const Discord = require("discord.js");
const config = require("./config.json");
var Twit = require('twit')

const client = new Discord.Client();

//Create Connection to Twitter API
var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60 * 1000,  //HTTP request timeout to apply to all requests.
    strictSSL: true     //Require SSL certificates to be valid.
})

client.on("ready", () => {
    client.user.setActivity('@latest <twitter_name> in the chat'); //Set Activity Text
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //Gets Latest Tweet from "account"
    if (command === "latest" && args.length == 1) {
        var account = args;
        T.get('search/tweets', { from: account, q: "-filter:replies AND -filter:retweets", count: 1 }, function (err, data, response) {
            var stringdata = JSON.stringify(data);
            var stringlocation = stringdata.indexOf('id_str');
            var id = stringdata.substring(stringlocation + 9, stringlocation + 28);

            console.log("http://twitter.com/" + account + "/status/" + id);
            message.channel.send("http://twitter.com/" + account + "/status/" + id);
        })
    } else if (command === "latest"){
        message.channel.send("Command not propertly built, not the correct amount of arguments. Example: @latest <twitter_name>");
    }

    //Query Twitter API, searching for tweet with search query args[1] from account args[0]
    if (command === "raw" && args.length == 2) {
        console.log(args[0] + " " + args[1]);
        var account = args[0];
        T.get('search/tweets', { from: account, q: args[1], count: 1 }, function (err, data, response) {
            var stringdata = JSON.stringify(data);
            var stringlocation = stringdata.indexOf('id_str');
            var id = stringdata.substring(stringlocation + 9, stringlocation + 28);

            console.log("http://twitter.com/" + account + "/status/" + id);
            message.channel.send("http://twitter.com/" + account + "/status/" + id);
        })
    } else if (command === "raw"){
        message.channel.send("Command not propertly built, not the correct amount of arguments. Example: @raw <twitter_name> <search_query>");
    }

    //Debugs command by getting unfiltered output of args[0] command with args[1] input
    //Not much command support, dev command
    if (command === "debug" && args.length == 1) {
        if (args[0] == "latest") {
            var account = args[1];
            T.get('search/tweets', { from: account, q: "-filter:replies AND -filter:retweets", count: 1 }, function (err, data, response) {
                var stringdata = JSON.stringify(data);
                message.channel.send(stringdata.substring(0,2000));
            })
        } else {
            message.channel.send("I don't know that command.");
        }
        console.log(args);
    }
});

client.login(config.token);