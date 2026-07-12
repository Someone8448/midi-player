// ==UserScript==
// @name        ChatSpace Cursors over Custom
// @namespace   Violentmonkey Scripts
// @icon
// @version     1.0.0
//
// @match       https://chat.8448.space/servers/*
// @grant       none
//
// @author      Someone8448
// @description
// ==/UserScript==
if (!client.addons) client.addons = {};
client.addons.cursor = {ppl: {}, self: {x: 0.5, y: 0.5}};
client.on('login', () => client.send({m: "guild", type: "+custom", event: "cursor"}));
window.addEventListener('mousemove', msg => {
  //console.log(msg.clientX / window.innerWidth, msg.clientY / window.innerHeight);
  client.addons.cursor.self.x = msg.clientX / window.innerWidth;
  client.addons.cursor.self.y = msg.clientY / window.innerHeight;
  client.addons.cursor.self.sent = false;
});
setInterval(() => {
  if (!client.connected || !client.channel || client.addons.cursor.self.sent) return;
  client.send({m: "channel", type: "custom", channel: client.channel, data: {m: "cursor", x: Number(client.addons.cursor.self.x.toFixed(4)), y: Number(client.addons.cursor.self.y.toFixed(4))}});
  client.addons.cursor.self.sent = true;
}, 50)
client.on('custom', msg => {
  if (msg.data?.m !== "cursor" || isNaN(msg.data?.x) || isNaN(msg.data?.y)) return;
  if (!client.addons.cursor.ppl[msg.user]) {
    //cursor join
    client.addons.cursor.ppl[msg.user] = {x: +msg.data.x, y: +msg.data.y, id: msg.user, time: Date.now()};
    client.send({m: "user", id: msg.user});
    client.addons.cursor.ppl[msg.user].div = document.createElement("div");
    client.addons.cursor.ppl[msg.user].div.className = "cursor-addon";
    client.addons.cursor.ppl[msg.user].div.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 999;
    left: 0;
    top: 0;
    background-size: contain;
    transition: transform 0.1s linear;
    will-change: transform;
    `
    document.body.appendChild(client.addons.cursor.ppl[msg.user].div)
    var imgEl = document.createElement('img');
    imgEl.src = "data:image/png;base64,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";
    imgEl.style.height = "30px";
    imgEl.style.width = "30px";
    var nameEl = document.createElement("span");
    nameEl.textContent = "Loading...";
    client.addons.cursor.ppl[msg.user].img = imgEl;
    client.addons.cursor.ppl[msg.user].text = nameEl;
    client.addons.cursor.ppl[msg.user].div.append(imgEl, nameEl)
  } else {
    //stuff to do when cursor is simply updating
    client.addons.cursor.ppl[msg.user].x = +msg.data.x;
    client.addons.cursor.ppl[msg.user].y = +msg.data.y;
    client.addons.cursor.ppl[msg.user].time = Date.now();
  }
  //things to do when both happens
    client.addons.cursor.ppl[msg.user].div.style.transform = `translate(${client.addons.cursor.ppl[msg.user].x * window.innerWidth}px, ${client.addons.cursor.ppl[msg.user].y * window.innerHeight}px)`;
    //client.addons.cursor.ppl[msg.user].div.style.left = `${client.addons.cursor.ppl[msg.user].x * window.innerWidth}px`;
    //client.addons.cursor.ppl[msg.user].div.style.top = `${client.addons.cursor.ppl[msg.user].y * window.innerHeight}px`;

});
setInterval(() => {
  var curDate = Date.now()
  Object.values(client.addons.cursor.ppl).forEach(curs => {
    if (curDate <= curs.time + 60000) return;
    //cursor leave
    curs.div.remove();
    delete client.addons.cursor.ppl[curs.id];

  })
}, 1000) //check for outdated cursors
client.on('user', msg => {
  if (msg.invalid || !client.addons.cursor.ppl[msg.id]) return;
  client.addons.cursor.ppl[msg.id].user = msg;
  var nameEl = client.addons.cursor.ppl[msg.id].text
  nameEl.textContent = msg.nickname
  if (!localStorage.noChatColors) {
		if (msg.color2 && !localStorage.disableGradient) {
			nameEl.style.backgroundImage = `linear-gradient(90deg, ${msg.color}, ${msg.color2})`;
			nameEl.style.backgroundClip = "text";
			nameEl.style.color = "transparent";
			nameEl.style.textShadow = "0px 0px"
		} else nameEl.style.color = msg.color;
	} else {
    nameEl.style.backgroundImage = null;
    nameEl.style.backgroundClip = null;
    nameEl.style.color= null;
    nameEl.style.textShadow = null;
  };
})
