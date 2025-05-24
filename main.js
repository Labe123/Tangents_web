// main.js
// Assumes firebase.js and router.js have been loaded.
// 'auth', 'db', and 'router' should be globally available.

// Global App State
let currentUser = null;
let currentLobbyId = null;
let currentLobbyData = null;
let unsubscribeLobby = null;
let unsubscribeGameState = null; // For the global game state listener

// --- ROUTE REGISTRATION ---
// Central place to register all your application routes.
// This should happen after router.js is loaded but before any navigation attempts.
// The initFunctionName should match the function name in your screen's JS file.
function registerApplicationRoutes() {
    if (typeof router === 'undefined') {
        console.error("Router is not defined. Ensure router.js is loaded before main.js.");
        return;
    }

    try {
        router.register('home', 'home-screen', 'Home_screen_init');
        router.register('joinLobby', 'join-lobby-screen', 'Join_lobby_init');
        router.register('createLobby', 'create-lobby-screen', 'Create_lobby_init');
        router.register('lobby', 'lobby-screen', 'Lobby_screen_init');
        router.register('settings', 'settings-screen', 'Settings_screen_init');
        router.register('statementSubmission', 'statement-submission-screen', 'Statement_submission_init');
        router.register('waitingForPlayers', 'waiting-for-players-screen', 'Waiting_for_players_init');
        router.register('stanceSelection', 'stance-selection-screen', 'Stance_selection_init');
        router.register('debate', 'debate-screen', 'Debate_screen_init');
        router.register('voting', 'voting-screen', 'Voting_screen_init');
        router.register('debateResult', 'debate-result-screen', 'Debate_result_init');
        router.register('roundResult', 'round-result-screen', 'Round_result_init');
        router.register('gameComplete', 'game-complete-screen', 'Game_complete_init');
        // Add a loading screen route if you have one
        // router.register('loading', 'loading-screen', 'Loading_screen_init');
        console.log("Application routes registered successfully.");
    } catch (error) {
        console.error("Error registering routes:", error);
    }
}

// Initialize the application
function initializeApp() {
    // Register routes first
    registerApplicationRoutes();

    // Set up authentication
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                console.log("User signed in anonymously:", currentUser.uid);
                // Navigate to home screen if we're not already in a lobby
                if (!currentLobbyId) {
                    router.navigateTo('home');
                }
            } else {
                currentUser = null;
                console.log("User signed out or not yet authenticated.");
                auth.signInAnonymously().catch(error => {
                    console.error("Error signing in anonymously:", error);
                    const appContainer = document.getElementById('app-container');
                    if (appContainer) {
                        appContainer.innerHTML = `<p style="color:red; text-align:center;">Could not connect. Please refresh.</p>`;
                    }
                });
            }
        });
    } else {
        console.error("Firebase 'auth' service is not available. Check script loading order.");
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Helper function to generate a 4-digit room code
function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper function to get player data
async function getPlayerData(lobbyId, playerId) { /* ... (same as before) ... */ }
// Helper function to get all players
async function getAllPlayers(lobbyId) { /* ... (same as before) ... */ }


// Global listener for critical game state changes
function listenToGlobalGameState(lobbyIdForListener) {
    if (unsubscribeGameState) unsubscribeGameState();
    if (!lobbyIdForListener || typeof db === 'undefined' || typeof router === 'undefined') return;

    unsubscribeGameState = db.collection('lobbies').doc(lobbyIdForListener)
        .onSnapshot((doc) => {
            if (!doc.exists) {
                console.warn("Global listener: Lobby deleted.");
                if (currentLobbyId === lobbyIdForListener) {
                    alert("The game lobby no longer exists. Returning to home screen.");
                    cleanupListenersAndState();
                    router.navigateTo('home');
                }
                return;
            }

            const lobbyData = doc.data();
            currentLobbyData = lobbyData;

            // Handle game termination condition (less than X players)
            // ... (your existing logic for this, ensure it calls router.navigateTo if needed) ...

            // Centralized navigation based on gameState
            const targetRouteName = mapGameStateToRouteName(lobbyData.gameState);
            const currentRouteInfo = router.getCurrentRoute();

            if (targetRouteName && currentRouteInfo.route !== targetRouteName) {
                console.log(`Global state change: Navigating from '${currentRouteInfo.route}' to '${targetRouteName}' due to gameState '${lobbyData.gameState}'`);
                router.navigateTo(targetRouteName, { lobbyData: lobbyData }); // Pass lobbyData as param
            } else if (lobbyData.gameState === "lobby_ended_early" && currentRouteInfo.route !== 'home') {
                alert(lobbyData.statusMessage || "The game has ended unexpectedly.");
                cleanupListenersAndState();
                router.navigateTo('home');
            }
        }, error => {
            console.error("Error in global game state listener:", error);
            if (currentLobbyId === lobbyIdForListener) {
                alert("Connection error with the game. Returning to home screen.");
                cleanupListenersAndState();
                router.navigateTo('home');
            }
        });
}

function mapGameStateToRouteName(gameState) {
    // This mapping connects Firestore gameState values to your router's route names
    const mapping = {
        "lobby": "lobby",
        "statement_submission": "statementSubmission",
        "waiting_for_players": "waitingForPlayers",
        "stance_selection": "stanceSelection",
        "debate": "debate",
        "voting": "voting",
        "debate_results": "debateResult",
        "round_results": "roundResult",
        "game_complete": "gameComplete"
        // "lobby_ended_early" is handled separately above
    };
    return mapping[gameState] || null;
}

function cleanupListenersAndState() {
    if (unsubscribeLobby) {
        unsubscribeLobby();
        unsubscribeLobby = null;
    }
    if (unsubscribeGameState) {
        unsubscribeGameState();
        unsubscribeGameState = null;
    }
    currentLobbyId = null;
    currentLobbyData = null;
    console.log("Cleaned up listeners and lobby state.");
}

// Example of how a screen JS file would navigate:
// In Create_lobby.js, after successful lobby creation:
// currentLobbyId = newRoomCode;
// listenToGlobalGameState(currentLobbyId); // Start global listener
// router.navigateTo('lobby', { newLobby: true }); // Or let global listener handle it if gameState changes