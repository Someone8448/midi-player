// ==UserScript==
// @name        Audio Killer
// @namespace   Violentmonkey Scripts
// @match       https://mppclone.com/*
// @match       https://mpp.8448.space/*
// @match       https://multiplayerpiano.com/*
// @match       https://multiplayerpiano.net/*
// @match       https://multiplayerpiano.org/*
// @match       https://piano.mpp.community/*
// @match       https://mpp.autoplayer.xyz/*
// @match       https://mpp.hyye.tk/*
// @match       https://mppclone.hri7566.info/*
// @match       https://piano.ourworldofpixels.com/*
// @match       https://mpp.hri7566.info/*
// @match       https://mppclone.hri7566.info/*
// @grant       none
// @version     1.0
// @author      -
// @description 7/26/2023, 6:54:25 PM
// ==/UserScript==
function debounce() { if (!window.MPP) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
  MPP.client.preventsPlaying = () => {return false}
  MPP.piano.audio.play = () => {}; MPP.piano.audio.stop = () => {}
  /*
  MPP.client.on('ch', msg => {
    var channel = JSON.parse(JSON.stringify(msg))
    if (channel.ch.settings.chat) return
    channel.ch.settings.chat = true
    MPP.client.emit('ch', channel)
  })
  */
}
