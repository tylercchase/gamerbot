const Discord = require('discord.js');
const {token} = require('./config.json');
const {movieCommand} = require('./spreadsheets')
const client = new Discord.Client();
let presence = new Discord.ClientPresence(client,{game: 'How moist can a boi get?'})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({game: {name: 'How moist can a boi get?'}})
});
client.on('message',async msg => {
    splitStuff = msg.content.split(' ');
    if(splitStuff[0] == "!roll" || splitStuff[0] == '!r'){
        let rolls = [];
        splitStuff = splitStuff.slice(1);
        splitStuff.forEach((roll,index) => {
            roll = roll.split("d");
            if(roll[0]===''){
                roll = roll[1]
            }
            if(roll <= 0){ 
            }
            if(roll.length <= 2 && roll.length != 0){
                if(roll.length != 1  && Array.isArray(roll)){
                    let indiv = [];
                    for(let x = 0; x < roll[0]; x++){
                        indiv[x] = Math.floor(Math.random() * roll[1] + 1); 
                    }
                    rolls[index] = indiv;
                }
                else {
                    if(Array.isArray(roll)){
                        rolls[index] = Math.floor(Math.random() * Number(roll[0])) + 1;
                    }
                    else {
                        rolls[index] = Math.floor(Math.random() * roll) + 1;
                    }
                }
            }
        });
        let output = ''
        rolls.forEach(roll => {
            if(Array.isArray(roll)){
                if(roll.length <= 20){
                    output += (roll.join(', '));
                }
                else {
                    output += 'Alot of numbers...';
                }
                output += (' = ');
                output += roll.reduce((a, b) => a + b);
                output += ('\n');
            }
            else{
                if(Number.isInteger(roll))
                {
                    output += roll;
                    output += '\n';
                }
            }
        });
        if(output){
            msg.reply(output);
        }
    } else if(splitStuff[0] == "!suggest"){
        movieCommand(splitStuff[1])
        msg.react('👍')
    }
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
    
});
  client.login(token);