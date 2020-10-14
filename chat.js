let nameColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";

let chat = document.getElementById('app-chat-msg');

function connect(username) {
    const ws = new WebSocket(`ws://${document.location.hostname}:9898/`);

    ws.onopen = function() {
        ws.send(JSON.stringify({
            type: "newConnection",
            name: username,
            nameColor: nameColor
        }));
    }

    ws.addEventListener("open", () => {
        console.log("Connected to server");
        chat.innerHTML = chat.innerHTML +  `<i>Connected as ${username}</i><br>`
    })
}