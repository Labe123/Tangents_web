// screens/Create_lobby.js
// Only visual rendering, no logic or Firebase interaction


function Create_lobby_init(params) {
    const screenElement = document.getElementById('create-lobby-screen');
    if (!screenElement) return;

    // Add Google Fonts for handwritten style (Permanent Marker)
    if (!document.getElementById('google-font-permanent-marker')) {
        const link = document.createElement('link');
        link.id = 'google-font-permanent-marker';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap';
        document.head.appendChild(link);
    }

    screenElement.innerHTML = `
        <div style="position: absolute; top: 40px; right: 60px;">
            <div style="background: #fff; color: #222; border-radius: 20px; padding: 8px 18px; font-size: 13px; font-family: monospace; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">#Create_Lobby.js</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
            <div style="background: #5d9936; color: #111; border-radius: 20px; padding: 40px 60px; margin-bottom: 60px; min-width: 400px; text-align: center;">
                <span style="font-family: 'Permanent Marker', cursive; font-size: 3em;">Tangents</span>
            </div>
            <div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center;">
                <label for="create-lobby-name-input" style="font-size: 1.1em; margin-bottom: 10px; color: #111; align-self: flex-start; margin-left: 10%;">Enter name:</label>
                <input id="create-lobby-name-input" type="text" placeholder="" style="width: 70%; min-width: 320px; max-width: 500px; padding: 22px 24px; border: none; border-radius: 36px; background: #a2e86b; font-size: 1.3em; margin-bottom: 60px; outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.04);" autocomplete="off" />
            </div>
            <button id="host-game-btn" style="margin-top: 30px; background: #a2e86b; color: #111; border: none; border-radius: 18px; padding: 32px 80px; font-size: 1.3em; font-weight: 500; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: background 0.2s;">Host Game</button>
        </div>
    `;

    // Add event listeners
    const nameInput = document.getElementById('create-lobby-name-input');
    const hostGameBtn = document.getElementById('host-game-btn');

    // Disable button initially
    hostGameBtn.disabled = true;
    hostGameBtn.style.opacity = '0.5';
    hostGameBtn.style.cursor = 'not-allowed';

    // Enable/disable button based on name input
    nameInput.addEventListener('input', () => {
        const name = nameInput.value.trim();
        hostGameBtn.disabled = !name;
        hostGameBtn.style.opacity = name ? '1' : '0.5';
        hostGameBtn.style.cursor = name ? 'pointer' : 'not-allowed';
    });

    // Handle host game button click
    hostGameBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if (!name) return;

        try {
            // Sign in anonymously
            const userCredential = await auth.signInAnonymously();
            const user = userCredential.user;

            // Generate a 4-digit room code
            const roomCode = Math.floor(1000 + Math.random() * 9000).toString();

            // Create the lobby in Firestore
            const lobbyRef = db.collection('lobbies').doc(roomCode);
            await lobbyRef.set({
                hostId: user.uid,
                hostName: name,
                players: [{
                    id: user.uid,
                    name: name,
                    isHost: true
                }],
                gameState: 'lobby',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                settings: {
                    rounds: 1 // Default to 1 round
                }
            });

            // Navigate to lobby screen
            router.navigateTo('lobby', { 
                roomCode: roomCode,
                playerId: user.uid,
                playerName: name,
                isHost: true
            });

        } catch (error) {
            console.error('Error creating lobby:', error);
            alert('Failed to create lobby. Please try again.');
        }
    });
}

window.Create_lobby_init = Create_lobby_init;
