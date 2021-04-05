module.exports.run = (message) => {
    message.channel.send("Hello :D");
}

module.exports.config = {
    name: "hello",
    aliases: ["hi", "hey", "yo"]
}