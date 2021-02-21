const Discord = require('discord.js');
const {token} = require('./config.json');
const client = new Discord.Client();
let presence = new Discord.ClientPresence(client,{game: 'How moist can a boi get?'})
let announcement;
let announcementChannel;
let reactionRoles;
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message',async msg => {
    splitStuff = msg.content.split(' ');
    if(splitStuff[0] == "!roll"){
        let rolls = [];
        splitStuff = splitStuff.slice(1);
        splitStuff.forEach((roll,index) => {
            roll = roll.split("d");
            console.log('Before',roll)
            if(roll[0]===''){
                roll = roll[1]
            }
            if(roll <= 0){ 
            }
            console.log('After',roll)
            if(roll.length <= 2 && roll.length != 0){
                if(roll.length != 1  && typeof roll === Array){
                    console.log("MULTIPLE")
                    let indiv = [];
                    for(let x = 0; x < roll[0]; x++){
                        indiv[x] = Math.floor(Math.random() * roll[1] + 1); 
                    }
                    rolls[index] = indiv;
                }
                else {
                    console.log("SINGLE")
                    rolls[index] = Math.floor(Math.random() * roll[1]) + 1;
                }
            }
        });
        let output = ''
        console.log('Hello peeps',rolls)
        rolls.forEach(roll => {
            console.log(roll);
            if(Array.isArray(roll)){
                console.log("Hello array")
                output += (roll.join(', '));
                output += (' = ');
                output += roll.reduce((a, b) => a + b);
                output += ('\n');
            }
            else{
                console.log(typeof(roll));
                if(Number.isInteger(roll))
                {
                    console.log("Hello Number")
                    output += roll;
                    output += '\n';
                }
            }
        });
        console.log("output",output)
        if(output){
            msg.channel.send(output);
        }
    }
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
    
});
  client.login(token);