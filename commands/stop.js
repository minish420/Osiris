module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
            return message.channel.send("There is no music playing.")
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("You are not in a voice chat.")
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

module.exports.config = {
    name: "stop",
    aliases: ["s", "st"]
}