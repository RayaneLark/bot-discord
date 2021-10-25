const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bot = require('./app');

//bot requirements
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(process.env.WEBHOOK_URL);


/**** User variable ****/
const user = {
  username: process.env.USER_NAME,
  password: process.env.PASS_WORD
}

/**** Data varibale ****/
/*
var data = {
  module: '',
  seance: '',
  date: '',
  time: '',
  url: ''
}
/**** Function that generate a JWT token ****/
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1200s'});
}

/**** Function that verify if the JWT is still up ****/
function verifyToken(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err) => {
      if(err) {
        console.log(err.message);
        res.redirect('/');
      } else {
        next();
      }
    })
  } else {
    res.redirect('/');
  }
}

/**** Route after we log in ****/
router.get('/acad-a-home', verifyToken, (req, res) => {
    res.render('home');
})


router.post('/', (req, res) => {
  
    if (req.body.username !== user.username) {
      res.redirect('/')
    }
    if (req.body.password !== user.password) {
      res.redirect('/')
    }
  
    else {
      const accessToken = generateAccessToken(user);
      console.log(accessToken);
      res.cookie('jwt', accessToken, {httpOnly:true, maxAge: 20*60000});
      res.redirect('/acad-a-home');
    }

});
  
  
router.post('/acad-a-home', (req, res) => {
    let data = req.body;
    
    let embed = new MessageBuilder()
    .setColor('#FF0000')
    .setTitle(data.seance)
    .addField("\u200b", "\u200b")
    .addField('Module', data.module )
    .addField('Date', data.date)
    .addField('Heure', data.time)
    .addField('Lien', data.url)
    
    client.on('ready', (msg) => {
      msg.channel.send(msg.guild.defaultRole.toString());
    });
  
    hook.send(embed);
    res.redirect('/acad-a-home');
    console.log(data);
})
  
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
});

module.exports = router;