// ==UserScript==
// @name        MPP Friends
// @namespace   Violentmonkey Scripts
// @match       https://multiplayerpiano.net/*
// @match       https://multiplayerpiano.org/*
// @grant       none
// @version     1.0
// @author      Someone8448
// @description 8/7/2025, 3:00:52 PM
// ==/UserScript==
function debounce() { if (!window.MPP) {requestAnimationFrame(() => { debounce(); }); return;} startCode(); } debounce(); function startCode() {
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
  var custom = {msgs: [], buffer: 500, global: true};
  custom.send = (data, user) => {
    custom.msgs.push([data, user]);
    if (custom.interval) return;
    MPP.client.sendArray([{m: "custom", data: custom.msgs[0][0], target: {mode: "id", id: custom.msgs[0][1], global: custom.global}}]);
    custom.msgs.splice(0, 1);
    custom.interval = setInterval(() => {
      if (custom.msgs.length == 0) {
        clearInterval(custom.interval);
        delete custom.interval;
        return;
      }
      MPP.client.sendArray([{m: "custom", data: custom.msgs[0][0], target: {mode: "id", id: custom.msgs[0][1], global: custom.global}}]);
      custom.msgs.splice(0, 1);
    }, custom.buffer)
  }
  let Modal = `<div id="mppgc-menu" class="dialog" style="height: 350px; margin-top: -180px; display: none; overflow-y: scroll; font-size: 15px">
  <h4>Bot (Search and Select Server)</h4>
  <select id="mppgc-bot-list"></select>
  <button id="mppgc-bot-select" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Select</button>
  <button id="mppgc-bot-find" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Search</button>
  <button id="mppgc-bot-ping" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Ping</button>
  <button id="mppgc-bot-data" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Get Data</button>
  <br>
  <h4>Register (Must do before friending)</h4>
  <input id="mppgc-register-name" placeholder="Username" maxlength="48" autocomplete="off" />
  <select id="mppgc-register-status"><option value="2">Online</option><option value="1">Do Not Disturb</option><option value="0">Invisible</option></select>
  <button id="mppgc-register-confirm" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Register</button>
  <br>
  <h4>User Action (Friend, Unfriend, etc.)</h4>
  <input id="mppgc-action-id" placeholder="User ID" maxlength="27" autocomplete="off" />
  <select id="mppgc-action-list"><option value="add">Friend</option><option value="remove">Unfriend</option><option value="block">Block</option><option value="unblock">Unblock</option></select>
  <button id="mppgc-action-confirm" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Send</button>
  <span id="mppgc-action-res"></span>
  <br>
  <h4>Invite (a user to your room with an optional message)</h4>
  <input id="mppgc-invite-id" placeholder="ID" maxlength="27" autocomplete="off" />
  <input id="mppgc-invite-message" placeholder="Message (Optional)" maxlength="64" autocomplete="off" />
  <button id="mppgc-invite-confirm" style="background-color:#212121;color:#ffffff;border-radius:5px;box-shadow:0px 0px;">Invite</button>
  <h4>Friends List (Get Data Button to update)</h4>
  <div id="mppgc-friends-list"></div>

</div>`
  $('#modals').append(Modal);
  var frButton = document.createElement('div');
  frButton.id = "friends-button";
  frButton.className ="ugly-button";
  frButton.textContent = "Friends"
  frButton.addEventListener('click', () => openMPPGC());
  document.getElementById('buttons').appendChild(frButton)
  window.openMPPGC = () => openModal('#modal #modals #mppgc-menu');
  MPP.client.on('custom', data => {
    if (data.data.m !== "smngc" && data.data.evtn !== "smngc") return;
    if (data.data.t === "find") {
      if (data.data.reg === undefined) return;
      var item = document.getElementById(`mppgc-bot-${data.p}`);
      if (item) {
        item.textContent = `${data.p}` + (data.data.reg ? ` - ${data.data.reg} (${data.data.status})` : '');
      } else {
        var item = document.createElement('option');
        item.id = `mppgc-bot-${data.p}`
        item.value = data.p;
        item.textContent = `${data.p}` + (data.data.reg ? ` - ${data.data.reg} (${data.data.status})` : '');
        document.getElementById('mppgc-bot-list').append(item);
      }
    }
    if (data.p !== localStorage.mppgc) return;
    var msg = data.data;
    if (msg.t === "reg") {
      var item = document.getElementById(`mppgc-bot-${data.p}`);
      if (item) {
        item.textContent = `${data.p}` + (data.data.reg ? ` - ${data.data.reg} (${data.data.status})` : '');
      } else {
        var item = document.createElement('option');
        item.id = `mppgc-bot-${data.p}`
        item.value = data.p;
        item.textContent = `${data.p}` + (data.data.reg ? ` - ${data.data.reg} (${data.data.status})` : '');
        document.getElementById('mppgc-bot-list').append(item);
        document.getElementById('mppgc-bot-list').value = localStorage.mppgc;
      }
    } else if (msg.t === "invite") {
      var annDiv = document.createElement('div');
      var spantxt = document.createElement('span');
      spantxt.textContent = `${msg.p} invited you to join `;
      annDiv.append(spantxt);
      var link = document.createElement('a');
      link.href = `javascript:MPP.client.setChannel(${JSON.stringify(msg.c)})`;
      link.textContent = msg.c;
      annDiv.append(link);
      if (msg.a) {
        var extra = document.createElement('span');
        extra.textContent = ` - ${msg.a}`;
        annDiv.append(extra);
      }
      new MPP.Notification({"m":"notification","duration":-100,"target":"#room","html":annDiv.innerHTML,"title":"Invite."})
    } else if (msg.t === "add") {
      document.getElementById('mppgc-action-res').textContent = msg.a ? "Success" : "Fail";
    } else if (msg.t === "remove") {
      document.getElementById('mppgc-action-res').textContent = msg.a ? "Success" : "Fail";
    } else if (msg.t === "block") {
      document.getElementById('mppgc-action-res').textContent = msg.a ? "Success" : "Fail";
    } else if (msg.t === "unblock") {
      document.getElementById('mppgc-action-res').textContent = msg.a ? "Success" : "Fail";
    } else if (msg.t === "list") {
      var frDiv = document.getElementById('mppgc-friends-list');
      frDiv.innerHTML = "";
      msg.a.forEach(user => {
        var userDiv = document.createElement('div');
        userDiv.addEventListener('click', () => {
          document.getElementById('mppgc-invite-id').value = user[0];
          document.getElementById('mppgc-action-id').value = user[0];
        });
        var nameSpan = document.createElement('span');
        nameSpan.textContent = `[${user[0]}] ${user[1]}${(user[2].length ? ' in ': ' offline')}`;
        userDiv.append(nameSpan);
        if (!user[2].length) return frDiv.append(userDiv);
        user[2].forEach((room, i) => {
          var link = document.createElement('a');
          link.href = `javascript:MPP.client.setChannel(${JSON.stringify(room)})`;
          link.textContent = room;
          userDiv.append(link);
          if (i >= user[2].length - 1) return;
          var splitSpan = document.createElement('span');
          splitSpan.textContent = ', ';
          userDiv.append(splitSpan);
        })
        frDiv.append(userDiv);
      })
    }`javascript:MPP.client.setChannel(${JSON.stringify(msg.c)})`
  });
  setInterval(() => {
    if (!localStorage.mppgc || !localStorage.mppgc.length) return;
    custom.send({m: "smngc", t: "ping", channel: MPP.client.channel._id}, localStorage.mppgc);
  }, 15000)
  MPP.chat._oldgcsend = MPP.chat.send;
  MPP.chat.send = (msg) => {
    if (msg.trim().toLowerCase() === "mppgc") return openMPPGC();
    MPP.chat._oldgcsend(msg);
  }
  document.getElementById('mppgc-bot-find').addEventListener('click', () => MPP.client.sendArray([{m: "custom", data: {m: "smngc", t: "find"}, target: {mode: "subscribed", global: true}}]));
  document.getElementById('mppgc-bot-select').addEventListener('click', () => {localStorage.mppgc = document.getElementById('mppgc-bot-list').value;});
  document.getElementById('mppgc-bot-ping').addEventListener('click', () => custom.send({m: "smngc", t: "ping", channel: MPP.client.channel._id}, localStorage.mppgc));
  document.getElementById('mppgc-bot-data').addEventListener('click', () => custom.send({m: "smngc", t: "list"}, localStorage.mppgc));
  document.getElementById('mppgc-register-confirm').addEventListener('click', () => {
    custom.send({m: "smngc", t: "reg", name: document.getElementById('mppgc-register-name').value, status: Number(document.getElementById('mppgc-register-status').value)}, localStorage.mppgc)
  })
  document.getElementById('mppgc-action-confirm').addEventListener('click', () => {
    custom.send({m: "smngc", t: document.getElementById('mppgc-action-list').value, user: document.getElementById('mppgc-action-id').value}, localStorage.mppgc);
  });
  document.getElementById('mppgc-invite-confirm').addEventListener('click', () => {
    custom.send({m: "smngc", t: "invite", user: document.getElementById('mppgc-invite-id').value, channel: MPP.client.channel._id, message: document.getElementById('mppgc-invite-message').value}, localStorage.mppgc)
  })

              }
