 // ==UserScript==
// @name        Translator
// @namespace   Violentmonkey Scripts
// @match       https://smnmpp.hri7566.info:*/*
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
// @match       https://smp-meow.com/*
// @grant       none
// @version     1.0
// @author      someone8448
// @description 7/26/2023, 8:55:09 AM
// ==/UserScript==
function debounce() { if (!window.MPP) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
  globalThis.trans = {};
  trans.load = () => {
    try {
      trans.conf = JSON.parse(localStorage.translator);
    } catch (error) {
      trans.conf = {
        use: "google",
        in: {from: "en", to: "en"},
        out: {from: "en", to: "en"},
        prefix: "trans",
        showorig: true
      }
    }
  }
  trans.save = () => {
    localStorage.translator = JSON.stringify(trans.conf);
  }
  trans.load();
  trans.save();
  trans.queue = []
  trans.translate = async (opt) => {
try {
if (opt.use === "lib") {
var res = await fetch("http://127.0.0.1:5000/translate", {
        method: "POST",
        body: JSON.stringify({
                q: opt.data,
                source: opt.from,
                target: opt.to,
                format: "text",
                api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
}).then(a => a.json());
if (res.error) return [true, "", ""];
if (res.detectedLanguage) return [false, res.detectedLanguage.language, res.translatedText];
return [false, opt.from, res.translatedText];
} else if (opt.use === "google") {
var res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(opt.from)}&tl=${encodeURIComponent(opt.to)}&dt=t&dj=1&source=input&text=${encodeURIComponent(opt.data)}`).then((a) => a.json());
if (res.error) return [true, "", ""];
return [false, res.src, res.sentences[0].trans];
}
} catch (error) {
return [true, "", ""]
}
};
  MPP.chat._send = MPP.chat.send;
  MPP.chat._receive = MPP.chat.receive;
  MPP.chat._clear = MPP.chat.clear;
  trans.say = (message) => MPP.chat._receive({"m":"a","t":Date.now(),"a":message,"p":{"_id":"trans","name":"Translator","color":"#444444","id":"transl"}})
  trans.send = async (msg) => {
    if (msg.split(' ')[0] === trans.conf.prefix) {
      var args = msg.split(' ').slice(1);
      if (args[0] === "reset") {
        delete localStorage.translator;
        trans.load();
        trans.save();
        trans.say('Reset.');
      } else if (args[0] === "get") {
        var str = {arr: args.slice(1), out: trans.conf};
        for (var i = 0; i < str.arr.length; i++) {
          str.out = str.out[str.arr[i]];
        }
        trans.say(JSON.stringify(str.out));
      } else if (args[0] === "set") {
        eval(`trans.conf.${args[1]} = ${args.slice(2).join(' ')}`);
        trans.save()
        trans.say('Done.')
      } else trans.say('<get, reset, set>')
      return;
    }
    if (trans.conf.out.from === trans.conf.out.to) return MPP.chat._send(msg);
    var out = await trans.translate({use: trans.conf.use, from: trans.conf.out.from, to: trans.conf.out.to, data: msg});
    if (out[0]) return MPP.chat._send('error translating');
    return MPP.chat._send(out[2]);
  }
  MPP.chat.send = trans.send;
  trans.receive = async (msg) => {
    if (trans.conf.in.from === trans.conf.in.to) return MPP.chat._receive(msg);
    var out = await trans.translate({use: trans.conf.use, from: trans.conf.in.from, to: trans.conf.in.to, data: msg.a});
    if (out[0]) {
      msg.a = "error translating";
    } else msg.a = (trans.conf.showorig ? (msg.a +  ' ') : "") + `(${out[1]}) ${out[2]}`;
    MPP.chat._receive(msg)
  }
  MPP.chat.receive = async (msg) => {
    var newStart = !!trans.queue.length;
    trans.queue.push(structuredClone(msg));
    if (newStart) return;
    while (trans.queue.length) {
      try {
        await trans.receive(trans.queue[0]);
        trans.queue.splice(0, 1);
      } catch (e) {}
    }
  }
  MPP.chat.clear = () => {
    trans.queue = [];
    MPP.chat._clear()
  }
}
