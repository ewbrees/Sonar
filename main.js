// When launching the .html file, use it via VSCode's Live Server extension
import { Player } from './Player.js';
import { Raycast } from './Raycast.js';
import { Level } from './Level.js';
import { Monster } from './Monster.js';
import { Wall } from './Wall.js';

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.style.backgroundColor = '#000'; // Background color

    let raycastBellUsageCount = 0;
    const maxRaycastBellUsage = 3;

    let isGameRunning = true; // Check to see if game should end/finish

    // Timer for random events
    let lastFrameTimeMs = 0; // Track the last frame time

    // Sounds (More to come)
    var soundBell = new Audio('Bell.mp3')
    function playBell() {
        soundBell.play();
    }

    var soundRadar = new Audio('Radar.mp3')
    soundRadar.loop = true;
    function playRadar() {
        soundRadar.play();
    }

    var monster = new Audio('monster_scream.wav')
    function playMonster() {
        monster.play();
    }

    // Player
    const player = new Player(650, 380, 10, 10, 2, canvas, false);
    
    // Walls
    const level1Walls = [
        new Wall(500, 100, 100, 300, player, canvas, false, 10, 1),
        new Wall(750, 100, 150, 450, player, canvas, false, 20, 1),
        new Wall(0, 510, 600, 210, player, canvas, false, 20, 1),
        new Wall(700, 180, 300, 100, player, canvas, false, 20, 1),
        new Wall(1100, 100, 100, 515, player, canvas, false, 20, 1),
        new Wall(600, 510, 300, 105, player, canvas, false, 20, 1),
        new Wall(500, 100, 600, 0, player, canvas, false, 20, 1),
        new Wall(100, 180, 400, 100, player, canvas, false, 20, 1),
        new Wall(1300, 100, 100, 515, player, canvas, true, 20, 1),
        new Wall(1200, 615, 100, 0, player, canvas, true, 20, 1),
        new Wall(1400, 350, 300, 100, player, canvas, true, 20, 1)
    ];
    
    const level2Walls = [
        new Wall(220, 0, 100, 360, player, canvas, true, 40, 1),
        new Wall(220, 360, 100, 360, player, canvas, true, 40, 1),
        new Wall(750, 0, 100, 360, player, canvas, true, 40, 1),
        new Wall(750, 360, 100, 360, player, canvas, true, 40, 1),
        new Wall(1400, 0, 100, 360, player, canvas, true, 40, 1),
        new Wall(1400, 360, 100, 360, player, canvas, true, 40, 1)
    ];

    const level3Walls = [
        new Wall(500, 400, 10, 150, player, canvas, false, 0, 0),
        new Wall(500, 550, 300, 10, player, canvas, false, 0, 0),
        new Wall(800, 400, 10, 160, player, canvas, false, 0, 0), 
        new Wall(800, 400, 200, 10, player, canvas, false, 0, 0), 
        new Wall(1000, 400, 10, 320, player, canvas, false, 0, 0),
        new Wall(700, 720, 300, 10, player, canvas, false, 0, 0),
        new Wall(700, 620, 10, 100, player, canvas, false, 0, 0),
        new Wall(500, 620, 210, 10, player, canvas, false, 0, 0),
        new Wall(500, 520, 10, 100, player, canvas, false, 0, 0),
        new Wall(300, 520, 200, 10, player, canvas, false, 0, 0),
        new Wall(300, 100, 10, 420, player, canvas, false, 0, 0),
        new Wall(300, 100, 1300, 10, player, canvas, false, 0, 0),
        new Wall(1600, 100, 10, 400, player, canvas, false, 0, 0),
        new Wall(1400, 500, 200, 10, player, canvas, false, 0, 0) 
    ];
    
    const level4Walls = [
        // Top half
        new Wall(0, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(178, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(356, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(534, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(712, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(890, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1068, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1246, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1424, 300, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1602, 300, 178, 60, player, canvas, true, 100, 0.5),

        // Bottom half
        new Wall(0, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(178, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(356, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(534, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(712, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(890, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1068, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1246, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1424, 360, 178, 60, player, canvas, true, 100, 0.5),
        new Wall(1602, 360, 178, 60, player, canvas, true, 100, 0.5)
    ];
    
    const levelEdWalls = [
        // Corners
        new Wall(1190, 0, 590, 250, player, canvas, false, 0, 0),
        new Wall(0, 470, 590, 250, player, canvas, false, 0, 0),
        new Wall(0, 0, 590, 250, player, canvas, false, 0, 0),
        new Wall(1190, 470, 590, 250, player, canvas, false, 0, 0),

        // Middle
        new Wall(690, 285, 400, 150, player, canvas, false, 0, 0),

        // Closing Walls
        new Wall(0, 0, 1780, 10, player, canvas, true, 120, 1),
        new Wall(0, 700, 1780, 10, player, canvas, true, 120, 1),
        new Wall(0, 0, 10, 720, player, canvas, true, 100, 1)
    ];
    
    const levelHuntWalls = [
        new Wall(0, 700, 100, 20, player, canvas, true, 10, 1), //Bottom Half
        new Wall(100, 680, 100, 60, player, canvas, true, 10, 1),
        new Wall(200, 640, 100, 100, player, canvas, true, 10, 1),
        new Wall(300, 620, 100, 100, player, canvas, true, 10, 1),
        new Wall(400, 600, 100, 120, player, canvas, true, 10, 1),
        new Wall(500, 550, 100, 140, player, canvas, true, 10, 1),
        new Wall(600, 530, 100, 160, player, canvas, true, 5, 0.2),
        new Wall(700, 510, 100, 180, player, canvas, true, 10, 1),
        new Wall(800, 490, 100, 200, player, canvas, true, 10, 1),
        new Wall(900, 470, 100, 225, player, canvas, true, 10, 1),
        new Wall(1000, 450, 100, 250, player, canvas, true, 10, 1),
        new Wall(1100, 430, 100, 275, player, canvas, true, 10, 1),
        new Wall(1200, 410, 100, 300, player, canvas, true, 10, 1),
        new Wall(1300, 350, 100, 325, player, canvas, true, 10, 1),
        new Wall(1400, 325, 100, 100, player, canvas, true, 10, 1),
        new Wall(1500, 300, 100, 100, player, canvas, true, 10, 1),
        new Wall(1600, 275, 100, 100, player, canvas, true, 10, 1),

        new Wall(0, 300, 100, 250, player, canvas, true, 10, 1), //Top Half
        new Wall(100, 275, 100, 250, player, canvas, true, 10, 1),
        new Wall(200, 250, 100, 250, player, canvas, true, 10, 1),
        new Wall(300, 225, 100, 250, player, canvas, true, 10, 1),
        new Wall(400, 200, 100, 250, player, canvas, true, 10, 1),
        new Wall(500, 175, 100, 250, player, canvas, true, 10, 1),
        new Wall(700, 125, 100, 250, player, canvas, true, 10, 1),
        new Wall(800, 100, 100, 250, player, canvas, true, 10, 1),
        new Wall(900, 75, 100, 250, player, canvas, true, 10, 1),
        new Wall(1000, 50, 100, 250, player, canvas, true, 10, 1),
        new Wall(1100, 25, 100, 250, player, canvas, true, 10, 1),
        new Wall(1200, 0, 100, 250, player, canvas, true, 10, 1),
        new Wall(1300, 0, 100, 225, player, canvas, true, 10, 1),
        new Wall(1400, 0, 100, 200, player, canvas, true, 10, 1),
        new Wall(1500, 0, 100, 175, player, canvas, true, 10, 1),
        new Wall(1600, 0, 100, 150, player, canvas, true, 10, 1)
    ];


    // Listen I know I know I should (probably) make a class for this stuff
    // but I will when I got more time alright leave me alone
    // End point stuff 
    const endPoint = { x: 950, y: 400, width: 50, height: 50 };
    const level2endPoint = { x: 1600, y: 600, width: 50, height: 50 };
    const level3endPoint = { x: 400, y: 650, width: 50, height: 50 };
    const level4endPoint = { x: 850, y: 100, width: 50, height: 50 };
    const levelEdendPoint = { x: 1650, y: 360, width: 50, height: 50 };
    const levelHuntendPoint = { x: 1720, y: 200, width: 50, height: 50 };

    // Monsters
    const monsters = [
        new Monster(650, 500, 50, 50, false, 0, player, false, 0),
        new Monster(1000, 200, 50, 50, false, 0, player, false, 0),
        new Monster(100, 300, 50, 50, false, 0, player, false, 0),
        new Monster(1300, 500, 50, 50, false, 0, player, false, 0),
        new Monster(100, 500, 50, 50, false, 0, player, false, 0),
        new Monster(100, 500, 50, 50, false, 0, player, false, 0)
    ];
    
    const monsterslvl2 = [
    ];

    const monsterslvl3 = [
        new Monster(1700, 50, 50, 50, true, 0.55, player, false, 0.05),
        new Monster(700, 380, 50, 50, false, 0, player, false, 0),
        new Monster(1100, 520, 50, 50, false, 0, player, false, 0)
    ];

    const monsterslvl4 = [
        new Monster(1700, 50, 50, 50, true, 0.65, player, false, 0.1),
        new Monster(20, 50, 50, 50, true, 0.65, player, false, 0.1)
    ];

    const monsterslvlEd = [
        new Monster(1700, 700, 50, 50, true, 0.8, player, false, 0.3),
    ];

    const monsterslvlHunt = [
    ];

    let startgameTexts = [
        { text: "Navigate your vehicle with the arrow keys.", opacity: 0, y: canvas.height / 2 - 20 },
        { text: "Produce radars by clicking your controls at the top, you've been delegated 3 sonar blasts.", opacity: 0, y: canvas.height / 2 + 20 },
        { text: "Look for the exit, it will ping green, the walls white, threats red.", opacity: 0, y: canvas.height / 2 + 60  },
        { text: "Start your sonar at the top right to begin.", opacity: 0, y: canvas.height / 2 + 100 }
    ];

    let level2Texts = [
        { text: "Trust your surroundings, ride the edges.", opacity: 0, y: canvas.height / 2 - 20 }
    ]

    let level3Texts = [
        { text: "Threats that blip red are always stationary.", opacity: 0, y: canvas.height / 2 - 20 }
    ]

    let level4Texts = [
        { text: "THEY CAN GO THROUGH WALLS.", opacity: 0, y: canvas.height / 2 - 20 }
    ]

    let levelEdTexts = [
        { text: "The walls are closing in...", opacity: 0, y: canvas.height / 2 - 20 }
    ]

    let levelHuntTexts = [
        { text: "Don't get squished.", opacity: 0, y: canvas.height / 2 - 20 }
    ]

    // Level builders
    const levels = [
        new Level(player, { x: 360, y: 380}, level1Walls, endPoint, startgameTexts, canvas, ctx, monsters),
        new Level(player, { x: 50, y: 360}, level2Walls, level2endPoint, level2Texts, canvas, ctx, monsterslvl2),
        new Level(player, { x: 20, y: 640}, levelHuntWalls, levelEdendPoint, levelHuntTexts, canvas, ctx, monsterslvlHunt),
        new Level(player, { x: 550, y: 400}, level3Walls, level3endPoint, level3Texts, canvas, ctx, monsterslvl3),
        new Level(player, { x: 100, y: 360}, levelEdWalls, levelEdendPoint, levelEdTexts, canvas, ctx, monsterslvlEd),
        new Level(player, { x: 850, y: 580}, level4Walls, level4endPoint, level4Texts, canvas, ctx, monsterslvl4),
    ]

    let currentLevel = 0;

    // Raycaster instances
    const raycastBell = new Raycast(canvas, player, levels[currentLevel].walls, 180, 24, 1000, 90, false, false, false, playBell, false, 1000, false, levels[currentLevel].endPoint, levels[currentLevel].monsters);
    const raycastRadar = new Raycast(canvas, player, levels[currentLevel].walls, 720, 30, 300, 100, true, true, true, false, false, 1000, true, levels[currentLevel].endPoint, levels[currentLevel].monsters);
    const raycastNone = { // instance of 'none selected'
        visibility: false,
        triggerPing: function() {}, // No operation functions to replace the class ones
        expandRays: function() {},
        castRays: function() {},
        drawRays: function() {},
    };

    // Array of sound types
    const soundTypes = [raycastBell, raycastRadar, raycastNone];
    let currentType = 2; // Start with the first type (raycastNone)

    // Sound select buttons (assuming we add more in the html)
    document.getElementById('buttonContainer').addEventListener('click', function(event) {
        const typeIndex = event.target.getAttribute('data-type');
        if (typeIndex !== null) {
            let newIndex = parseInt(typeIndex, 10); // Convert the data-type value to an integer

            if (newIndex !== 2) {
                levels[currentLevel].textsShown = true;  // Hide texts once any active raycaster is selected
            }

            if (newIndex !== 2 && currentType === 2 && !levels[currentLevel].endpointFadeInitiated) {  // Check if changing from 'none'
                levels[currentLevel].activateEndpoint(); // Activate endpoint showing
            }

            // Check if the radar is active and the radar button is clicked again
            if (newIndex === 1) {
                if (currentType === 1) {
                    // Radar is already active, switching it off
                    newIndex = 2; // Set to 'none' (assuming index 2 is raycastNone in your array)
                    document.querySelector('#radarButton').style.backgroundImage = 'url("Radar_Echo_Button.png")';
                } else {
                    // Activating radar
                    document.querySelector('#radarButton').style.backgroundImage = 'url("Radar_Echo_Button_Lit.png")';
                }
            } else if (currentType === 1) {
                // Deactivating radar due to switching to another type
                document.querySelector('#radarButton').style.backgroundImage = 'url("Radar_Echo_Button.png")';
            }

            // If raycastBell is selected and usage limit is reached, do nothing
            if (newIndex === 0 && raycastBellUsageCount >= maxRaycastBellUsage) {
                return;
            }

            currentType = newIndex;
            soundTypes[currentType].triggerPing(); // Trigger the ping for the selected sound type

            // Only count usages for raycastBell
            if (currentType === 0) { 
                raycastBellUsageCount++;
            }

            updateButtonSelection(); // Call a function to update the button visuals
        }
    });
    
    function updateButtonSelection() {
        // Get all buttons within the container
        const buttons = document.querySelectorAll('#buttonContainer button');
        // Iterate over each button and update its class and background based on whether it's the selected type
        buttons.forEach((button, index) => {
            if (index === 0) { // RaycastBell button specific logic
                // Update the button's background image according to the usage count
                button.style.backgroundImage = `url('Bell_Echo_Button_${raycastBellUsageCount}.png')`;
                
                // Disable the button if the usage limit is reached
                if (raycastBellUsageCount >= maxRaycastBellUsage) {
                    button.disabled = true;
                    button.classList.add('disabled'); // Assuming a CSS class for disabled appearance
                } else {
                    button.disabled = false;
                    button.classList.remove('disabled');
                }
            }
    
            // Add or remove 'selected' class based on the active type
            if (index === currentType) {
                button.classList.add('selected'); // Add 'selected' class to the active type
            } else {
                button.classList.remove('selected'); // Remove 'selected' class from other types
            }
        });
    }

    function resetButtons() {
    // Reset the raycastBell usage count and update its button
    raycastBellUsageCount = 0;
    const bellButton = document.querySelector('#bellButton'); // Corrected ID reference
    if (bellButton) {
        bellButton.style.backgroundImage = 'url("Bell_Echo_Button_0.png")';
        bellButton.disabled = false;
        bellButton.classList.remove('disabled');
    }

    // Reset the raycastRadar button to its default state
    const radarButton = document.querySelector('#radarButton'); // Corrected ID reference
    if (radarButton) {
        radarButton.style.backgroundImage = 'url("Radar_Echo_Button.png")';
    }

    // Update all buttons to unselected
    const buttons = document.querySelectorAll('#buttonContainer button');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    // Optionally, set the first raycaster as selected or none if you want to start with a specific one
    if (buttons.length > 0) {
        buttons[0].classList.add('selected');
    }
}

    // Event listeners for keyups and keydowns (smoother movement)
    window.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "ArrowUp":    player.activeDirections.up = true; break;
            case "ArrowDown":  player.activeDirections.down = true; break;
            case "ArrowLeft":  player.activeDirections.left = true; break;
            case "ArrowRight": player.activeDirections.right = true; break;
            
            // dev tools
            case 'r':
                soundTypes[currentType].visibility = !soundTypes[currentType].visibility;
                break;
            case 'n':
                nextLevel();
                break;
        }
    });

    window.addEventListener('keyup', function(event) {
        switch (event.key) {
            case "ArrowUp":    player.activeDirections.up = false; break;
            case "ArrowDown":  player.activeDirections.down = false; break;
            case "ArrowLeft":  player.activeDirections.left = false; break;
            case "ArrowRight": player.activeDirections.right = false; break;
        }
    });
    
    function checkLevelCompletion() {
        if (
            player.x < levels[currentLevel].endPoint.x + levels[currentLevel].endPoint.width &&
            player.x + player.width > levels[currentLevel].endPoint.x &&
            player.y < levels[currentLevel].endPoint.y + levels[currentLevel].endPoint.height &&
            player.y + player.height > levels[currentLevel].endPoint.y
        ) {
            nextLevel();  // Use nextLevel function to handle level transition
        }
    }
    
    function nextLevel() {
        if (currentLevel < levels.length - 1) {
            currentLevel++;
            levels[currentLevel].activate();
            resetButtons();
            updateRaycasters();  // Update raycasters with new level walls
            currentType = 2; // Reset raycaster to none
        } else {
            congratulatePlayer();  // End game logic if no more levels
        }
    }

    function updateRaycasters() {
        // Update the walls and goal for each raycaster upon level transition
        raycastBell.walls = levels[currentLevel].walls;
        raycastRadar.walls = levels[currentLevel].walls;
        raycastBell.endPoint = levels[currentLevel].endPoint;
        raycastRadar.endPoint = levels[currentLevel].endPoint;
        raycastBell.monsters = levels[currentLevel].monsters;
        raycastRadar.monsters = levels[currentLevel].monsters;
    }

    function congratulatePlayer() {
        isGameRunning = false;  // Set the game state to not running
    
        const ctx = document.getElementById('gameCanvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  // Clear the canvas
    
        const congratsMessage = document.createElement('h1');
        congratsMessage.textContent = 'You win.. for now.';
        congratsMessage.style.color = '#fff';
        congratsMessage.style.position = 'absolute';
        congratsMessage.style.top = '50%';
        congratsMessage.style.left = '50%';
        congratsMessage.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(congratsMessage);
    }
    

    function gameEnd() {
        // Death logic
        playMonster();
        levels[currentLevel].monsters.forEach(monster => {
            monster.resetPosition(); // Reset each monster's position
        });
        levels[currentLevel].activate();
        resetButtons();
        updateRaycasters();
        currentType = 2;
    }

    function gameLoop(timestamp) {
        if (!isGameRunning) return; // Stop loop if game has finished

        const deltaTime = timestamp - lastFrameTimeMs; // Calculate delta time
        lastFrameTimeMs = timestamp; // Update last frame time

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        player.update(levels[currentLevel].walls);
        player.draw(ctx);


        if (levels[currentLevel]) {
            levels[currentLevel].update(deltaTime);
            levels[currentLevel].draw();
        }

        // Monster current level update
        levels[currentLevel].monsters.forEach(monster => {
            monster.draw(ctx);
            monster.update(deltaTime, levels[currentLevel].endpointActive);
            if (monster.checkCollision(player)) {
                gameEnd();
            }
        });

        requestAnimationFrame(gameLoop);
        
        // Manage raycast expansions and drawing
        if (soundTypes[currentType] !== raycastNone) {
            if (soundTypes[currentType].pingActive) {
                soundTypes[currentType].expandRays();
            }
            soundTypes[currentType].castRays();
            soundTypes[currentType].drawRays(ctx);
        }

        // Special sound feature for Radar
        if (currentType === 1) { // Radar is selected
            if (soundRadar.paused) {
                soundRadar.play();
            }
        } else {
            soundRadar.pause(); // Pause if Radar is not selected
            soundRadar.currentTime = 0; // Optionally reset the playback position
        }

        checkLevelCompletion();
    }

    requestAnimationFrame(gameLoop);
    //gameLoop();
});