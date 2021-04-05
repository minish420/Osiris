const ytdl = require('ytdl-core');
const ytpl = require('ytpl')
const Discord = require('discord.js')

module.exports.run = async (client, message, args, queue, searcher) => {
    const vc = message.member.voice.channel;
    if(!vc)
        return message.channel.send("You are not in a voice chat.");

    let url = args.join("");
    if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
        await ytpl(url).then(async playlist =>{
            message.channel.send(`The playlist: "${playlist.title}" has been added.`)
            playlist.items.forEach(async item => {
                await videoHandler(await ytdl.getInfo(item.shortUrl), message, vc, true);
            })
        })
    }
    else{
        let result = await searcher.search(args.join(" "), { type: "video" })
        if(result.first === null)
            return message.channel.send("No results found for this song/playlist.");

        let songInfo = await ytdl.getInfo(result.first.url);
        return videoHandler(songInfo, message, vc)
    }

    async function videoHandler(songInfo, message, vc, playlist = false){
        const serverQueue = queue.get(message.guild.id);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            vLength: songInfo.videoDetails.lengthSeconds,
            thumbnail: songInfo.videoDetails.thumbnails[3].url
        }
        if(!serverQueue){
            const queueConstructor = {
                txtChannel: message.channel,
                vChannel: vc,
                connection: null,
                songs: [],
                volume: 10,
                playing: true,
                loopone: false,
                loopall: false,
                skipvotes: []
            };
            queue.set(message.guild.id, queueConstructor);

            queueConstructor.songs.push(song);

            try{
                let connection= await queueConstructor.vChannel.join();
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
            }catch (err){
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`Unable to join the voice chat. ${err}`)
            }
        }else{
            serverQueue.songs.push(song);
            if(playlist) return message.channel.send("Playlist has been added")


            let dur = `${parseInt(song.vLength / 60)}:${song.vLength - 60 * parseInt(song.vLength / 60)}`
            let msg = new Discord.MessageEmbed()
                .setTitle("Song Added")
                .addField(song.title, "_____")
                .addField("Song duration: ", dur)
                .setThumbnail(song.thumbnail)
                .setColor("PURPLE")
            return message.channel.send(msg);
        }
        
            function play(guild, song){
            const serverQueue = queue.get(guild.id);
            if(!song){
                serverQueue.vChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on('finish', ()=>{
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                    
                })
                let dur = `${parseInt(serverQueue.songs[0].vLength / 60)}:${serverQueue.songs[0].vLength - 60 * parseInt(serverQueue.songs[0].vLength / 60)}`
                let msg = new Discord.MessageEmbed()
                    .setTitle("Now playing:")
                    .addField(serverQueue.songs[0].title, "_____")
                    .addField("Song duration: ", dur)
                    .setThumbnail(serverQueue.songs[0].thumbnail)
                    .setColor("PURPLE")
                return message.channel.send(msg);
        }
    }

}

module.exports.config = {
    name: "play",
    aliases: ["p", "pl"]
}