﻿var snowmen = document.getElementsByClassName("snowman"), // the box
    game_mode = 0,
    game_max_seconds = 10,
    game_state = "Start",
    game_end = 0,
    game_start = 0,
    number_of_snowman = 0,
    key = 0,
    snowman_start = 0,
    snowman_end = 0,
    snowman_size = 0,
    minimum_size = 100,
    previous_size = 50,
    score = 0,
    time = 0,
    delta = 0,
    lastFrameTimeMs = 0,
    maxFPS = 30,
    delta = 0,
    timestep = 1000 / 30;


// NEAT AI
console.log(brain)
let puppet 

var hasMusic = false;
function backgroundMusic() {
    if (!hasMusic) {
        x = new Audio("music.mp3");
        x.autoplay = true;
        x.loop = true;
        x.play();
        hasMusic = true;
    }

}

function gametime() {
    let random = Math.random();
    game_time = Math.log(10000 * random) / Math.log(10000)
    game_time = game_time * game_max_seconds * 1000;
    return game_time;
}


function getSnowmanImage(x) {
    x = x % 4 + 1;
    return "url(sprite_"+x+".png)"
}

function snowmanSize(t) {
    // t milliseconds
    // return size in pixels
    t = t ** 1.1
    //t = (t * 0.03)
    //t = Math.round(t)
    return (t)
}

function addSnowman(size) {
    if (size >= minimum_size) {
        score += size * 100
    }
}

function startGameMode(mode) {
    game_mode = mode;
    game_state = "Play";
    backgroundMusic();
    title_card = document.getElementById("title");
    title_card.innerText = "";
    score = 0;
    game_start = Date.now()
    game_end = game_start + gametime();
    score_card = document.getElementById("score")
    score_card.style.color = "black";
    var snowmen = document.querySelectorAll(".snowman");
    if (snowmen.length > 0) {
        snowmen.forEach((element) => {
            element.remove();
        });
    }
    switch (mode) {
        case 0: // single player
            key = 0,
                number_of_snowman = 0,
                snowman_start = 0,
                snowman_end = 0,
                snowman_size = 0,
                previous_size = 50,
                score = 0,
                time = 0,
                lastFrameTimeMs = 0,
                delta = 0;
            document.getElementById("nn").style.visibility = "hidden"
            break;
        case 1: // NEAT AI
            key = 0,
                number_of_snowman = 0,
                snowman_start = 0,
                snowman_end = 0,
                snowman_size = 0,
                previous_size = 50,
                score = 0,
                time = 0,
                delta = 0,
                lastFrameTimeMs = 0;
            puppet = new Genome()
            puppet.game_random_end = game_end - game_start
            document.getElementById("nn").style.visibility = "visible"

            break;
        case 2: // 2-player
            break;
    }

}

function stopGameMode() {
    switch (game_mode) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;

    }
    console.log(score)
    score = 0
    game_state = "End";
    console.log("GAME OVER")
    key = 0;
    title_card = document.getElementById("title")
    title_card.innerText = "GAME OVER!";
    score_card = document.getElementById("score")
    score_card.style.color = "red";

}

function updateAI() {
    actions = brain.activate(puppet.inputss())
    puppet.act(actions, Date.now() - game_start)

    if (puppet.game_elapsed >= puppet.game_random_end) {
        console.log("Game restart")
        startGameMode(1)
    }
}

function draw() {

    score_card = document.getElementById("score")

    time_card = document.getElementById("time")
    elapsed_card = document.getElementById("elapsed")

    switch (game_mode) {
        case 0:
            if (game_state == "Play") {
                var elapsed_time = ((now - game_start) / 1000).toFixed(2);
                score_card.innerText = "Score: " + (score / elapsed_time).toFixed(2);
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;

                if (key == 1) time_card.innerText = ((Date.now() - snowman_start) / 1000).toFixed(2)
                else time_card.innerText = ""
            }
            break;
        case 1:
            if (game_state == "Play") {
                updateAI()
                var elapsed_time = ((now - game_start) / 1000).toFixed(2);
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;
                score_card.innerText = "Score: " + (score / elapsed_time).toFixed(2);
                if (puppet.key == 1) time_card.innerText = (puppet.snowman_elapsed / 1000).toFixed(2)
                else time_card.innerText = ""
            }
            break;
        case 2:
            break;

    }

}

function update() {
    now = Date.now()
    switch (game_mode) {
        case 0:
            if (Date.now() >= game_end && game_state == "Play") {
                game_state = "End";
                console.log("GAME OVER")
                key = 0;
                title_card = document.getElementById("title")
                title_card.innerText = "GAME OVER!";
                score_card = document.getElementById("score")
                score_card.style.color = "red";

            }
            break;

        case 1:
            if (game_state == "Play") {
                gen_card = document.getElementById("gen")
                //temp = neat.getDesicions().toString()
                //if (temp != neatDecisions) console.log("NEAT!")
                //neatDecisions = temp
            }
            break;

        case 2:
            break;

    }

    deleteSnowflakes()
}

setInterval(addSnowflake, 100);

// Player input

document.addEventListener('keypress', (e) => {

    switch (game_state) {

        case "Start":
            if ((e.key == ' ' || e.key == '1') && key == 0) {
                console.log("down");
                startGameMode(0)
                snowman_start = Date.now();
                if (e.key == ' ') key = 1;
            } else if (e.key == "2" && key == 0) {
                console.log("down");
                startGameMode(1)
                snowman_start = Date.now();
                key = 0;
            }
            break;
        case "Play":

            if (e.key === 'z') {
                console.log("escape")
                stopGameMode();
            }

            switch (game_mode) {
                case 0:
                    if (e.key == ' ' && key == 0) {
                        snowman_start = Date.now();
                        key = 1;
                    }
                    break;
                case 1:
                    break;
                case 2:
                    break;
            }
            break;
        case "End":
            if (e.key == '1' && key == 0) {
                console.log("down");
                startGameMode(0)
                snowman_start = Date.now();
                key = 0;
            } else if (e.key == "2" && key == 0) {
                console.log("down");
                startGameMode(1)
                snowman_start = Date.now();
                key = 0;
            }
            break;


    }
});

document.addEventListener('keyup', (e) => {

    now = Date.now()

    switch (game_mode) {
        case 0:
            if (e.key == ' ' && key == 1 && game_state == "Play") {
                snowman_end = Date.now();
                snowman_size = snowmanSize(snowman_end - snowman_start);
                addSnowman(snowman_size);
                key = 0;
            } else if (e.key == ' ' && key == 1 && game_state == "End" && (now - game_end) > 2000) {
                key = 0;
                game_state = "Start",
                    game_end = 0,
                    game_start = 0,
                    number_of_snowman = 0,
                    snowman_start = 0,
                    snowman_end = 0,
                    snowman_size = 0,
                    previous_size = 50,
                    score = 0,
                    time = 0,
                    lastFrameTimeMs = 0,
                    delta = 0,
                title_card = document.getElementById("title");
                title_card.innerText = "Press and hold [space]";
            }
            break;
        case 1:
            break;
        case 2:
            break;
    }

    
});

function addSnowman(size) {
    //console.log("snowman!")
    // Minimum size
    if (size >= minimum_size) {

        switch (game_mode) {
            case 0:
                score += size / 10;
                break;
            case 1:
                score += size / 10
                break;
            case 2:
                break;
        }

        size = size * 0.05 // cosmetic scaling

        // Shift all other snowmen
        var snowmen = document.querySelectorAll(".snowman");

        if (snowmen.length > 0) {
            previous_size = snowmen[snowmen.length - 1].getBoundingClientRect().width;
            snowmen.forEach((element) => {

                let snowmen_props = element.getBoundingClientRect();

                // Delete the snowmen if they have moved out
                // of the screen hence saving memory
                if (snowmen_props.right <= 0) {
                    element.remove();
                } else {
                    element.style.left = (snowmen_props.left - previous_size / 2 - size / 2 - 10) + "px"
                }
            });

        }

        // Add new snowman
        var new_snowman = document.createElement('div');
        new_snowman.className = 'snowman';
        new_snowman.style.width = size + 'px';
        new_snowman.style.height = (size * 1.54) + 'px';
        new_snowman.style.left = 'calc(50% - ' + size / 2 + 'px)';
        new_snowman.style.backgroundImage = getSnowmanImage(number_of_snowman);
        document.body.appendChild(new_snowman);
        number_of_snowman++;
    }

}

function addSnowflake() {
    if (!document.hidden) {
        var new_snowflake = document.createElement('div');
        new_snowflake.className = "snowflake";
        new_snowflake.innerText = "❆";
        new_snowflake.style.opacity = (Math.random() + 0.5);
        new_snowflake.style.left = Math.random() * 100 + "%";
        new_snowflake.style.animation = "snowfall " + (Math.random() * 5 + 5) + "s linear forwards";
        document.body.appendChild(new_snowflake);
    }
}

function deleteSnowflakes() {
    var snowflakes = document.querySelectorAll(".snowflake");
    if (snowflakes.length > 0) {
        snowflakes.forEach((element) => {
            let snowflake_props = element.getBoundingClientRect();
            if (snowflake_props.bottom >= innerHeight * 0.7 || game_state != "Play") element.remove();
        });
    }
}

function panic() {
    delta = 0;
}

function mainLoop(timestamp) {
    // ...

    // Track the accumulated time that hasn't been simulated yet
    delta += timestamp - lastFrameTimeMs; // note += here
    lastFrameTimeMs = timestamp;

    // Simulate the total elapsed time in fixed-size chunks
    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
    }

    var numUpdateSteps = 0;
    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
        // Sanity check
        if (++numUpdateSteps >= 240) {
            panic(); // fix things
            break; // bail out
        }
    }

    draw();
    requestAnimationFrame(mainLoop);
}

// Start things off
requestAnimationFrame(mainLoop);