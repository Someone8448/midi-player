 // ==UserScript==
// @name        Smn's MPP Bot
// @namespace   Violentmonkey Scripts
// @match       https://mppclone.com/*
// @match       https://mpp.8448.space/*
// @match       https://multiplayerpiano.com/*
// @match       https://mpp.autoplayer.xyz/*
// @match       https://mpp.hyye.tk/*
// @match       https://mpp.141.lv/*
// @match       https://multiplayerpiano.net/*
// @match       https://multiplayerpiano.org/*
// @match       https://mppclone.hri7566.info/*
// @grant       none
// @version     1.0
// @author      someone8448
// @description 7/26/2023, 8:55:09 AM
// ==/UserScript==
var prefix = "/"
// DO NOT CHANGE THE 3 VARIABLES BELOW
var deblacking = false
var sustain = false
var public = true
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
var cmds = []
fetch("https://raw.githubusercontent.com/LapisHusky/midi-player-js-fixed/main/midiplayer.js").then(res => res.text()).then(body => {
    var scriptMIDIPlayerJS = document.createElement("script");
    scriptMIDIPlayerJS.type = 'text/javascript';
    scriptMIDIPlayerJS.appendChild(document.createTextNode(body));
    (document.body || document.head || document.documentElement).appendChild(scriptMIDIPlayerJS);
})
function debounce() { if (!window.MPP || !window.MidiPlayer) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
var data = {}
var speak = {}
speak.msgs = []
speak.say = function (msg) {
    if (speak.interval) return msg.match(/.{0,511}/g).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "a", a: x})})
    msg.match(/.{0,511}/g).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "a", a: x})})
    MPP.client.sendArray([{m: "a", message: speak.msgs[0].a}])
    speak.msgs.splice(0,1)
    speak.interval = setInterval(() => {
        if (speak.msgs.length == 0) { clearInterval(speak.interval); delete speak.interval; return;}
        if (speak.msgs[0].m === "a") MPP.client.sendArray([{m: "a", message: speak.msgs[0].a}])
        if (speak.msgs[0].m === "dm") MPP.client.sendArray([{m: "dm", message: speak.msgs[0].a, _id: speak.msgs[0]._id}])
        speak.msgs.splice(0,1)

    },1500)
}
speak.dm = function (msg,id) {
    if (speak.interval) return msg.match(/.{0,511}/g).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "dm", a: x, _id: id})})
    msg.match(/.{0,511}/g).forEach(function(x, i) { if (x == "") return; if (i !== 0) x = "" + x; speak.msgs.push({m: "dm", a: x, _id: id})})
    MPP.client.sendArray([{m: "dm", message: speak.msgs[0].a, _id: speak.msgs[0]._id}])
    speak.msgs.splice(0,1)
    speak.interval = setInterval(() => {
        if (speak.msgs.length == 0) { clearInterval(speak.interval); delete speak.interval; return;}
        if (speak.msgs[0].m === "a") MPP.client.sendArray([{m: "a", message: speak.msgs[0].a}])
        if (speak.msgs[0].m === "dm") MPP.client.sendArray([{m: "dm", message: speak.msgs[0].a, _id: speak.msgs[0]._id}])
        speak.msgs.splice(0,1)

    },1500)
}
MPP.client.on('a', async msg => {
    //if (msg.p._id === MPP.client.user._id) return;
    var cmd = msg.a.trim().split(' ')[0].toLowerCase()
    var args = msg.a.trim().substr(cmd.length).replace(/\s+/g, ' ').trim()
    if (!cmd.startsWith(prefix)) return;
    var command = cmds.find(c => c.name === cmd.slice(prefix.length) || c.aliases.includes(cmd.slice(prefix.length)))
    if (!command) return;
    command.run({dm: false, a: msg.a, p: msg.p, t: msg.t},args, speak.say)
})
  MPP.client.on('dm', async msg => {
    //if (msg.p._id === MPP.client.user._id) return;
    var cmd = msg.a.trim().split(' ')[0].toLowerCase()
    var args = msg.a.trim().substr(cmd.length).replace(/\s+/g, ' ').trim()
    if (!cmd.startsWith(prefix)) return;
    var command = cmds.find(c => c.name === cmd.slice(prefix.length) || c.aliases.includes(cmd.slice(prefix.length)))
    if (!command) return;
    command.run({dm: true, a: msg.a, p: msg.sender, t: msg.t},args, (m) => speak.dm(m, msg.sender._id))
})



function modalHandleEsc(evt) {
    if (evt.key == 'Escape') {
        closeModal();
    }
}

function openModal(selector, focus) {
    if (MPP.chat) MPP.chat.blur();
    // releaseKeyboard();
    $(document).on("keydown", modalHandleEsc);
    $("#modal #modals > *").hide();
    $("#modal").fadeIn(250);
    $(selector).show();
    setTimeout(function () {
        $(selector).find(focus).focus();
    }, 100);
    gModal = selector;
};

function closeModal() {
    $(document).off("keydown", modalHandleEsc);
    $("#modal").fadeOut(100);
    $("#modal #modals > *").hide();
    // captureKeyboard();
    gModal = null;
};



  function buttonon () {

const testb = document.createElement("chat");

       testb.setAttribute("class", "ugly-button smnbot");
        testb.setAttribute("id", "test-btn");
// old left is 1020px
        testb.style.position = "absolute";
        testb.style.left = "420px";
        testb.style.top = "32px";

        testb.innerText = "Player";

        testb.onclick = () => {
         openModal('#modal #modals #smnbot-menu');
        }
        $("#bottom .relative")[0].appendChild(testb);
       let Modal = `
<div id="smnbot-menu" class="dialog" style="height: 350px; margin-top: -180px; display: none;">
    <h4>Player</h4>
  <input type="file" id="smnbot-input" style="border-radius:5px;box-shadow:0px 0px;" />
  <button id="smnbot-load" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Load</button>
<br>
<button id="smnbot-on" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Play</button>
<button id="smnbot-off" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Stop</button>
<br>
  <button id="smnbot-deb" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Deblack</button>
  <button id="smnbot-sus" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Enable Sustain</button>
  <button id="smnbot-pub" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Playing to server and client</button>
  <br>
  <progress id="smnbot-bar"></progress>
</div>
`;
    $('#modals').append(Modal);
setInterval(() => {document.getElementById("smnbot-bar").value = (Player.isPlaying() && !isNaN(Player.totalTicks)) ? Player.tick / Player.totalTicks : 0},500)

//$('#smnbot-menu #smnbot-load').on('click', async () => {Player.loadArrayBuffer(readFileAsArrayBuffer(await $('#smnbot-menu #smnbot-input').prop('files')[0]));})
$('#smnbot-menu #smnbot-load').on('click', async () => {
  const file = $('#smnbot-menu #smnbot-input').prop('files')[0];
  if (!file) {
    // Handle the case where no file is selected
    return;
  }
  Player.stop()
  const fileContent = await readFileAsArrayBuffer(file);
  Player.loadArrayBuffer(fileContent);
});
$('#smnbot-menu #smnbot-on').on('click', async () => {if (Player.isPlaying()) {Player.pause(); $('#smnbot-menu #smnbot-on').text("Play")} else {Player.play(); $('#smnbot-menu #smnbot-on').text("Pause")}})
$('#smnbot-menu #smnbot-off').on('click', async () => {Player.stop(); $('#smnbot-menu #smnbot-on').text("Play");})
    $('#smnbot-menu #smnbot-deb').on('click', async () => {if (deblacking) {deblacking = !deblacking; $('#smnbot-menu #smnbot-deb').text("Deblack")} else {deblacking = !deblacking; $('#smnbot-menu #smnbot-deb').text("Reblack")}})
    $('#smnbot-menu #smnbot-sus').on('click', async () => {if (sustain) {sustain = !sustain; $('#smnbot-menu #smnbot-sus').text("Enable Sustain")} else {sustain = !sustain; $('#smnbot-menu #smnbot-sus').text("Disable Sustain")}})
    $('#smnbot-menu #smnbot-pub').on('click', async () => {if (public) {public = !public; $('#smnbot-menu #smnbot-pub').text("Playing to client")} else {public = !public; $('#smnbot-menu #smnbot-pub').text("Playing to server and client")}})

}; buttonon()


     const midikeys = ["a-1", "as-1", "b-1", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"];
    globalThis.Player = new MidiPlayer.Player(function (event) {
if ( (event.name === "Note on" && deblacking && event.velocity < 54) || MPP.noteQuota.points <= 0) return;

if (event.name === "Set Tempo") Player.setTempo(event.data)
        let midikey = midikeys[event.noteNumber - 21];
        let midivel = event.velocity / 127;
        if (!!!event.name.startsWith("Note")) return;

        if (event.name == "Note on") {
if (midikey !== undefined && midivel != 0 ) {

//MPP.client.startNote(midikey, midivel)
public ? MPP.press(midikey, midivel) : MPP.piano.play(midikey, midivel, MPP.client.getOwnParticipant(), 0)

}
        } else {
if (midikey !== undefined && !sustain) {

  //MPP.client.stopNote(midikey)
public ? MPP.release(midikey) : MPP.piano.stop(midikey, MPP.client.getOwnParticipant(), 0)

}
}
    })
  Player.on('endOfFile', () => $('#smnbot-menu #smnbot-on').text("Play"))

cmds.push({name: "test", aliases: ["tes"], type: 'testing', desc: "Simply a testing command, nothing else to see.", run: (msg,args,chat) => {chat('Ok I pull up!!!')}})
cmds.push({name: "help", aliases: ["h"], type: 'info', desc: "Gives help.", run: (msg,args,chat) => {chat(`Commands: ` + cmds.map(a => `\`${prefix}${a.name}\``).join(', '))}})
}
