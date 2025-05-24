// screens/Home_screen.js
// This is the first screen users see when they open the app

function Home_screen_init(params) {
    console.log("Home_screen_init called with params:", params);
    const screenElement = document.getElementById('home-screen');
    
    if (!screenElement) {
        console.error("Home screen element not found!");
        return;
    }
    
    // Set up the home screen content
    screenElement.innerHTML = `
        <div class="banner">Tangents</div>
        <div class="home-buttons">
            <button id="home-join-lobby-btn" class="home-button">Join Lobby</button>
            <button id="home-create-lobby-btn" class="home-button">Create Lobby</button>
        </div>
    `;

    // Add click handlers for the buttons
    const joinButton = document.getElementById('home-join-lobby-btn');
    const createButton = document.getElementById('home-create-lobby-btn');

    if (joinButton) {
        joinButton.addEventListener('click', () => {
            console.log("Join Lobby button clicked");
            if (typeof router !== 'undefined') {
                router.navigateTo('joinLobby');
            } else {
                console.error("Router not found!");
            }
        });
    }

    if (createButton) {
        createButton.addEventListener('click', () => {
            console.log("Create Lobby button clicked");
            if (typeof router !== 'undefined') {
                router.navigateTo('createLobby');
            } else {
                console.error("Router not found!");
            }
        });
    }
}

// Export the init function to make it globally available
window.Home_screen_init = Home_screen_init;