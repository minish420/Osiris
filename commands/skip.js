module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(message.member.voice.channel != message.guild.me.voice.channel)
            return message.channel.send("You are not in a voice chat.");
    if(!serverQueue)
        return message.channel.send("There is nothing to skip.");

    serverQueue.connection.dispatcher.end();
}

module.exports.config = {
    name: "skip",
    aliases: ["sk"]
}