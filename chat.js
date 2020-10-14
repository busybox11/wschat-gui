let nameColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";

let chat = document.getElementById('app-chat-msg');

function connect(username) {
    const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);
    document.getElementById('app-chat-header-name').innerHTML = `<b>${new URL("ws://127.0.0.1:9898/").host}</b>`;

    let userConnected = [];

    ws.onopen = function() {
        ws.send(JSON.stringify({
            type: "newConnection",
            name: username,
            nameColor: nameColor
        }));
    }

    ws.addEventListener("open", () => {
        console.log("Connected to server");

        ws.onmessage = function(msg) {
            let json = JSON.parse(msg.data);
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
            } else if (json.type == "message") {
                chat.innerHTML += `<div class="msg"><b style="color: ${json.nameColor}; height: fit-content">${json.name} </b><span>${json.data}</span><br></div>`;
            } else if (json.type == "LostAClient") {
                userConnected = json.data;
            }
        };
    })
}