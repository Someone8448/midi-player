 // ==UserScript==
// @name        Smn's Chat Logger
// @namespace   Violentmonkey Scripts
// @match       https://mppclone.com/*
// @match       http://mc.hri7566.info:8080/*
// @match       https://smnmpp.hri7566.info/*
// @match       https://multiplayerpiano.com/*
// @match       https://mpp.autoplayer.xyz/*
// @match       https://mpp.hyye.tk/*
// @match       https://playground-mpp.hyye.tk/*
// @match       https://mpp.141.lv/*
// @grant       none
// @version     1.0
// @author      someone8448
// @description 7/26/2023, 8:55:09 AM
// ==/UserScript==
function debounce() { if (!window.MPP) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
  var prefix = "/"
  var smnchat = {}
  var reply = (message) => MPP.chat.receive({"m":"a","t":Date.now(),"a":message,"p":{"_id":"logger","name":"Chat Logger","color":"#444444","id":"logger"}})
  function downloadFile (contents, name) {

  var blob = new Blob([contents], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  a.download = name;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  }
  MPP.client.on('c',msg => {
                if (!smnchat[MPP.client.desiredChannelId]) smnchat[MPP.client.desiredChannelId] = msg.c
  });
  MPP.client.on('a', msg => {
    if (!smnchat[MPP.client.desiredChannelId]) smnchat[MPP.client.desiredChannelId] = []
    smnchat[MPP.client.desiredChannelId].push(msg)
  })
  MPP.client.on('dm', msg => {
    if (!smnchat[MPP.client.desiredChannelId]) smnchat[MPP.client.desiredChannelId] = []
    smnchat[MPP.client.desiredChannelId].push(msg)
  })
  MPP.client.on('a', msg => {
    if (msg.p._id !== MPP.client.user._id) return;
    var cmd = msg.a.trim().split(' ')[0].toLowerCase()
    var args = msg.a.trim().substr(cmd.length).replace(/\s+/g, ' ').trim()
    var argsplit = args.split(' ')
    if (cmd === `${prefix}help`) reply(`Commands: ${prefix}help, ${prefix}logs`)
    if (cmd === `${prefix}logs`) {
      if (args.length == 0) return reply(`Usage: ${prefix}logs <options: view, ids, download> <args>`)
      if (argsplit[0] === "view") {
        var foundroom = smnchat[Object.keys(smnchat)[Number(argsplit[1])]]
        if (foundroom === undefined) return reply(`Invalid ID. Use \`${prefix}logs ids\` to get list of IDs.`)
        reply('Start of replication of logs.');
        foundroom.forEach(m => MPP.chat.receive(m))
        reply('End of replication of logs.')
      } else if (argsplit[0] === "download") {
        var foundroom = smnchat[Object.keys(smnchat)[Number(argsplit[1])]]
        if (foundroom === undefined) return reply(`Invalid ID. Use \`${prefix}logs ids\` to get list of IDs.`)
        if (argsplit[2] === 'raw') {downloadFile(JSON.stringify(foundroom), "logs-raw " + Object.keys(smnchat)[Number(argsplit[1])] + " .txt"); return reply('Downloaded as ' + "logs-raw " + Object.keys(smnchat)[Number(argsplit[1])] + ".txt")}
        var chat = [];
        foundroom.forEach(m => {
          if (m.m === "dm") chat.push(`DM [${(new Date(m.t)).toLocaleString()} (${m.t})] ${m.sender._id} ${m.sender.name} ==> ${m.recipient._id} ${m.recipient.name}: ${m.a}`)
          if (m.m === "a") chat.push(`[${(new Date(m.t)).toLocaleString()} (${m.t})] ${m.p._id} ${m.p.name}: ${m.a}`)
        })
        downloadFile(chat.join('\n'), "logs " + Object.keys(smnchat)[Number(argsplit[1])] + ".txt")
        reply('Downloaded as ' + "logs " + Object.keys(smnchat)[Number(argsplit[1])] + ".txt")
      } else if (argsplit[0] === "ids") {
        var rooms = Object.keys(smnchat)
        var make = []
        for (var i =0; i < rooms.length; i++) {
          make.push({i: i, n: rooms[i], m: smnchat[rooms[i]].length})
        }
        reply(make.map(m => `\`\`\`${m.n}\`\`\` (ID: \`${m.i}\`) (\`${m.m}\` messages)`).join(', '))
      } else return reply('Invalid option, options are view, ids, download')
    }
  })
}
