// router.js

const router = (() => {
    const routes = {}; // Stores { routeName: { screenId: 'screen-element-id', initFn: functionName } }
    let currentRoute = null;
    let currentParams = {};

    // All screen elements in the DOM
    // Querying once and caching can be slightly more performant if the DOM doesn't change.
    const screenElements = document.querySelectorAll('.screen');

    function registerRoute(routeName, screenId, initFunctionName) {
        if (typeof routeName !== 'string' || typeof screenId !== 'string') {
            console.error("Router: Invalid routeName or screenId for registration.");
            return;
        }

        // Check if the screen element exists
        const screenElement = document.getElementById(screenId);
        if (!screenElement) {
            console.error(`Router: Screen element with id '${screenId}' not found.`);
            return;
        }

        routes[routeName] = {
            screenId: screenId,
            initFunctionName: initFunctionName
        };
        console.log(`Router: Registered route '${routeName}' for screen '#${screenId}' with init '${initFunctionName || 'none'}'.`);
    }

    function navigateTo(routeName, params = {}) {
        if (!routes[routeName]) {
            console.error(`Router: Route "${routeName}" not found.`);
            return;
        }

        const routeConfig = routes[routeName];
        currentRoute = routeName;
        currentParams = params;

        console.log(`Router: Navigating to route '${routeName}' with params:`, params);

        // Hide all screens first
        screenElements.forEach(screen => {
            screen.style.display = 'none';
        });

        // Show and initialize the target screen
        const targetScreen = document.getElementById(routeConfig.screenId);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            
            // Call the screen's initialization function if provided
            if (routeConfig.initFunctionName) {
                const initFunction = window[routeConfig.initFunctionName];
                if (typeof initFunction === 'function') {
                    try {
                        console.log(`Router: Initializing screen for route '${routeName}' with function '${routeConfig.initFunctionName}'.`);
                        initFunction(params);
                    } catch (e) {
                        console.error(`Router: Error initializing screen for route '${routeName}' with function '${routeConfig.initFunctionName}':`, e);
                    }
                } else {
                    console.warn(`Router: Init function '${routeConfig.initFunctionName}' not found or not a function for route '${routeName}'.`);
                }
            }
        } else {
            console.error(`Router: Target screen element '${routeConfig.screenId}' not found.`);
        }
    }

    function getCurrentRoute() {
        return { route: currentRoute, params: currentParams };
    }

    // Expose public methods
    return {
        register: registerRoute,
        navigateTo: navigateTo,
        getCurrentRoute: getCurrentRoute
    };
})();

// Make router globally available
window.router = router;

// Example of how screens will register themselves (or main.js can do it)
// This part will be moved to where screens are defined or to main.js for central registration.
// router.register('home', 'home-screen', 'Home_screen_init');
// router.register('joinLobby', 'join-lobby-screen', 'Join_lobby_init');
// ... and so on for all your screens