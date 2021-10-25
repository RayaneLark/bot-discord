const jwt = require('jsonwebtoken');
const { Client, Intents } = require('discord.js')
const WOKCommands = require('wokcommands');
const path = require('path');


require('dotenv').config();

const express = require('express');
const app = express();
const session = require("express-session");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


/***************** BOT SECTION ****************/ 
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
bot.on('ready', function () {
  console.log("Connected")

  new WOKCommands(bot, {
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ['899345502917787668'],
  })
  .setDefaultPrefix('?')
  .setColor(0xff0000)

});
bot.login(process.env.DISCORD_TOKEN);
/*********************************************/

const router = require('./router');
app.use('/', router);

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {console.log('Server running on port 3000')});

module.exports = bot;