usernameSpan = document.getElementById('nav-panel-bottom-bar-username')

function askUsername() {
    username = window.prompt('Enter a username', 'anon');

    if (username == null) {
        askUsername()
    } else {
        usernameSpan.innerHTML = username
    }
}

askUsername()

usernameSpan.onclick = function() { askUsername() } 