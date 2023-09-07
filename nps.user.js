// ==UserScript==
// @name        NPS Tags
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
// @description 8/9/2023, 9:40:10 AM
// ==/UserScript==
var recordownnotes = true
function debounce() { if (!window.MPP) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
  var nps = {nps: {}}
MPP.client.on('n', msg => {
    var date = Date.now()
    if (!nps.nps[msg.p]) nps.nps[msg.p] = {}
    Object.keys(nps.nps[msg.p]).filter(a => date - 1000 > a).forEach(a => delete nps.nps[msg.p][a])
    nps.nps[msg.p][date] = msg.n.filter(n => n.s != 1).length
})
nps.getNps = (id) => {
if (!nps.nps[id]) return 0
    var date = Date.now()
    Object.keys(nps.nps[id]).filter(a => date - 1000 > a).forEach(a => delete nps.nps[id][a])
var n = 0
Object.values(nps.nps[id]).forEach(a => n+= a)
return n
}
setInterval(() => {
  Object.values(MPP.client.ppl).forEach(p => {
    if (p._id === MPP.client.user._id && !recordownnotes) return;
  if ($('#nametag-' + p._id).text().length != 0) return $('#nametag-' + p._id).text(p.tag ? `${p.tag.text} (${nps.getNps(p._id)} NPS)` : `${nps.getNps(p._id)} NPS`)
  var tagDiv = document.createElement('div')
    tagDiv.className = 'nametag';
    tagDiv.id = `nametag-${p._id}`;
    tagDiv.style['background-color'] = "#00000088";
    tagDiv.innerText = `${nps.getNps(p._id)} NPS`
    document.getElementById(`namediv-${p._id}`).prepend(tagDiv);
  })
},200)
  MPP.client.on('participant update', p => {
      if (p._id === MPP.client.user._id && !recordownnotes) return;
  if ($('#nametag-' + p._id).text().length != 0) return $('#nametag-' + p._id).text(p.tag ? `${p.tag.text} (${nps.getNps(p._id)} NPS)` : `${nps.getNps(p._id)} NPS`)
  var tagDiv = document.createElement('div')
    tagDiv.className = 'nametag';
    tagDiv.id = `nametag-${p._id}`;
    tagDiv.style['background-color'] = "#00000088";
    tagDiv.innerText = `${nps.getNps(p._id)} NPS`
    document.getElementById(`namediv-${p._id}`).prepend(tagDiv);
})
if (recordownnotes) {
var oldplay = MPP.press
MPP.press = (a,b) => {
  oldplay(a,b)
  if (MPP.client.user) {
    var date = Date.now()
    if (!nps.nps[MPP.client.user._id]) nps.nps[MPP.client.user._id] = {}
    Object.keys(nps.nps[MPP.client.user._id]).filter(a => date - 1000 > a).forEach(a => delete nps.nps[MPP.client.user._id][a])
    if (!nps.nps[MPP.client.user._id][date]) nps.nps[MPP.client.user._id][date] = 0
    nps.nps[MPP.client.user._id][date]++
  }

}
}
}
