let nameColor = `hsla(${~~(360 * Math.random())},70%,70%,0.8)`;

let chat = document.getElementById('app-chat-msg');
let chatbox = document.getElementById('chat-textbox');
let typing = document.getElementById('chat-typing-indicator');

let typingUsers = [];

function connect(username) {
    const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);
    document.getElementById('app-chat-header-name').innerHTML = `<b>${new URL("ws://127.0.0.1:9898/").host}</b>`;

    let userConnected = [];

    function updateTyping() {
        // TODO: use switch
        if (typingUsers.length == 0) {
            typing.innerHTML = '<br>';
        } else if (typingUsers.length == 1) {
            typing.innerHTML = `<b>${typingUsers[0]}</b> is typing`;
        } else {
            typing.innerHTML = `<b>${typingUsers.join(', ')}</b> are typing`;
        }
    }

    ws.onopen = function() {
        chatbox.disabled = false;
        ws.send(JSON.stringify({
            type: "newConnection",
            name: username,
            nameColor: nameColor
        }));
    };

    ws.addEventListener("open", () => {
        console.log("Connected to server");

        ws.onmessage = function(msg) {
            let json = JSON.parse(msg.data);
            // TODO: use switch
            if (json.type == "newConnection") {
                chat.innerHTML += `<i>${json.data} is connected.</i><br>`;
                userConnected = json.onlineUser;
            } else if (json.type == "connected") {
                chat.innerHTML += `<i>You're successfully connected as ${json.data}.</i><br>`;
                userConnected = json.onlineUser;
            } else if (json.type == "nameInvalid") {
                userConnected = json.userConnected;
    
                while (userConnected.includes(username)) {
                    username = prompt("Username already taken, choose another one.").trim();
                }
                ws.send(JSON.stringify({
                    type: "newConnection",
                    name: username,
                    nameColor: nameColor
                }))
            } else if (json.type == "typing") {
                if (json.name != username) {
                    if (json.data) {
                        if (!typingUsers.includes(json.name)) {
                            typingUsers.push(json.name);
                            updateTyping()
                        }
                    } else {
                        if (typingUsers.includes(json.name)) {
                            typingUsers.pop(json.name);
                            updateTyping()
                        }
                    }
                }
            } else if (json.type == "message") {
                chat.innerHTML += `<div class="msg"><b style="color: ${json.nameColor}; height: fit-content">${json.name} </b><span>${json.data}</span><br></div>`;
            } else if (json.type == "disconnecting") {
                chat.innerHTML += `<i>${json.name} is disconnected.</i><br>`;
            }
        };

        ws.onclose = function(event) {
            chatbox.disabled = true;
            chat.innerHTML += `<i>You've been disconnected</i><br>`;
            document.getElementById('app-chat-header-name').innerHTML = `Disconnected`;
        };
    })

    chatbox.addEventListener('keyup', function(event) {
        if (event.key == "Enter") {
            if (chatbox.value !== "") {
                ws.send(JSON.stringify({
                    type: "message",
                    name: username,
                    msg: chatbox.value,
                    nameColor: nameColor
                }));
                chatbox.value = "";
            };
        }
        if (chatbox.value !== "" && chatbox.value != null) {
            isTyping = true;
        } else {
            isTyping = false;
        }
        ws.send(JSON.stringify({
            type: "typing",
            data: isTyping,
            name: username
        }));
    });

    window.onbeforeunload = function(){
        ws.send(JSON.stringify({
            type: "disconnecting",
            name: username
        }));
        ws.close();
    }
}