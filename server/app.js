//  get modules
const express = require('express');
const https = require('https'); 
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const _ = require('lodash');

//  create instance
var app = express();
var httpsPort = 9999;
app.use(express.static('public'));

// Setup HTTPS
var options = {
  key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certificate.pem'))
};


module.exports = () => {
  try {
    //  read user input
    var msg = fs.readFileSync(path.join(__dirname, '../msg.txt'), 'utf-8');
    var targets = fs.readFileSync(path.join(__dirname, '../targets.txt'), 'utf-8');
    var template = fs.readFileSync(path.join(__dirname, '../public/template.js'), 'utf-8');
    //  process inputs
    targets = targets.split(','); //  get target names
    targets = _.map(targets, function (target) { //  turn into json representation for back injection
      return `'${target}'`;
    }).join(', ');
    targets = `[${targets}]`;
    var js = template.replace('@@msg', msg).replace(`'@@group'`, targets);
    fs.writeFileSync(path.join(__dirname, '../public/aw.js'), js, 'utf-8');

    //  fire up https server
    var secureServer = https.createServer(options, app).listen(httpsPort, function () {
      console.log(`打开copyme.txt，把内容复制粘贴到谷歌浏览器控制台，然后按回车!`);
    });
  } catch (err) {
    console.log('你他妈怎么把相关文件删了？操！重装着软件吧！');
  }
}


