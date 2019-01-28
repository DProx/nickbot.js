const Discord = require("discord.js"); //baixar a lib
const client = new Discord.Client(); 
const config = require("./config.json"); 
client.login(process.env.TOKEN)

client.on("ready", () => {
  console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`); 
  client.user.setPresence({ game: { name: 'Felicidade', type: 1, url: 'https://www.twitch.tv/oplanet'} });
// caso queira o bot trasmitindo use:
/*
   client.user.setPresence({ game: { name: 'comando', type: 1, url: 'https://www.twitch.tv/ladonegro'} });
    //0 = Jogando
    //  1 = Transmitindo
    //  2 = Ouvindo
    //  3 = Assistindo
      */
});

client.on("guildCreate", guild => {
  console.log(`O bot entrou nos servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
  client.user.setActivity(`Tudo tem seu tempo`);
});

client.on("guildDelete", guild => {
  console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Acesse: oplanet.tk`);
});


client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  
  // comando ping
  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`:ping_pong: | **Pong!** ${message.author} \n :control_knobs: | **Latência do WebSocket:** ${m.createdTimestamp - message.createdTimestamp}*ms*. \n :zap: | **Latência da API:** ${Math.round(client.ping)}*ms*`);
  }
  
  //comando falar
  if(comando === "say") { 
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }

  //comando apagar
  if(comando === "apagar") {
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Por favor, forneça um número entre **2** e **100** para o número de mensagens a serem excluídas");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
  }
  // comando chutar 
  if(comando === "kick") {
//adicione o nome dos cargos que vc quer que use esse comando!
    if(!message.member.roles.some(r=>["♛ Criador", "Nick & Health <3"].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.kickable) 
      return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    
    await member.kick(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
    message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);

  }
  
  // comando ban
  if(comando === "ban") {
    //adicione o nome do cargo que vc quer que use esse comando!
    if(!message.member.roles.some(r=>["Nome do cargo"].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.bannable) 
      return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    await member.ban(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
    message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
  }
  
  //comando avatar
  if(comando === "avatar") {
  let msg = await message.channel.send("Carregando o Avatar");
  let target = message.mentions.users.first() || message.author;

  await message.channel.send({files: [
    {
      attachment: target.displayAvatarURL,
      name: "avatar.png"
    }
  ]});

  msg.delete();
}
  
  //comando userinfo
  if(comando === "userinfo") {
    const Discord = module.require('discord.js');
  let memberInfo = message.mentions.members.first();

  if(!memberInfo){
    var userinf = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setThumbnail(message.author.avatarURL)
        .setDescription("Informações do usuário")
        .setColor('RANDOM')
        .addField("Full Username:", `${message.author.username}#${message.author.discriminator}`)
        .addField("ID:", message.author.id)
        .addField("Criado em:", message.author.createdAt)

        message.channel.send(userinf);

  }else{

    var userinfoo = new Discord.RichEmbed()
        .setAuthor(memberInfo.displayName)
        .setThumbnail(memberInfo.user.avatarURL)
        .setDescription("Informações de Usuário")
        .setColor('RANDOM')
        .addField("Username:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`)
        .addField("ID:", memberInfo.id)
        .addField("Criado em:", memberInfo.user.createdAt)

        message.channel.send(userinfoo);
  }

  }
  
  if(comando === "vote") {
    const Discord  = module.require('discord.js');

const agree    = "✅";
const disagree = "❎";

  let msg = await message.channel.send("Vote Agora! (10 Segundos)");
  await msg.react(agree);
  await msg.react(disagree);

  const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 10000});
  msg.delete();

  var NO_Count = reactions.get(disagree).count;
  var YES_Count = reactions.get(agree);

  if(YES_Count == undefined){
    var YES_Count = 1;
  }else{
    var YES_Count = reactions.get(agree).count;
  }

  var sumsum = new Discord.RichEmbed()
  
            .addField("Votação Finalizada:", "----------------------------------------\n" +
                                          "Votos totais (NÃO): " + `${NO_Count-1}\n` +
                                          "Votos totais (SIM): " + `${YES_Count-1}\n` +
                                          "----------------------------------------", true)

            .setColor("0x#FF0000")

  await message.channel.send({embed: sumsum});

}
  
  //comando de roleta-russa

if(comando ==="roleta-russa") {
  let replies = ["Você morreu!", "Você sobreviveu!", "Você levou um tiro de raspão!", "Você saiu ileso!"]

   let result = Math.floor((Math.random() * replies.length));

   let dadoembed = new Discord.RichEmbed()
   .setFooter(message.author.tag, message.author.displayAvatarURL)
   .setThumbnail(message.author.avatarURL)
   .setColor('RANDOM')
   .addField("O que será que aconteceu?", replies[result])

      message.channel.send(dadoembed); 
    }
  
  
});

client.login(config.token);