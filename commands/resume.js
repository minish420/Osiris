module.exports.run = (client, message, args, queue, searcher) => {
    const serverQueue = queue.get(message.guild.id)
    if(!serverQueue)
        return message.channel.send("There is no music currently playing.");
    if(message.member.voice.channel != message.guild.me.voice.channel)
        return message.channel.send("You are not in a voice chat.")
    if(serverQueue.connection.dispatcher.resumed)
        return message.channel.send("The song is already playing.");
    message.channel.send("The song has been resumed.");
    serverQueue.connection.dispatcher.resume();
}

module.exports.config = {
    name: "resume",
    aliases: ["r", "res"]
}