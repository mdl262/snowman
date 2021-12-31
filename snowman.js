var snowmen = document.getElementsByClassName("snowman"), // the box
    game_state = "Start",
    game_end = 0,
    game_start = 0,
    number_of_snowman = 0,
    key = 0,
    snowman_start = 0,
    snowman_end = 0,
    snowman_size = 0,
    minimum_size = 10,
    previous_size = 50,
    score = 0,
    time = 0,
    delta = 0,
    lastFrameTimeMs = 0,
    maxFPS = 30,
    delta = 0,
    timestep = 1000 / 60;


function backgroundMusic() {
    x = new Audio("music.mp3");
    x.autoplay = true;
    x.loop = true;
    x.play();
}

function gametime() {
    game_time = Math.random() * 60 * 1000;
    return game_time;
}


function getSnowmanImage(x) {
    x = x % 4 + 1;
    return "url(sprite_"+x+".png)"
}

function snowmanSize(t) {
    // t milliseconds
    // return size in pixels
    return Math.round(t*0.03)
}



function draw() {
   
    score_card = document.getElementById("score")
    score_card.innerText = "Score: " + Math.round(score);

    time_card = document.getElementById("time")
    elapsed_card = document.getElementById("elapsed")
    if (game_state == "Play") {
        elapsed_card.innerText = "Time elapsed: " + ((now - game_start) / 1000).toFixed(2)
    }
    if (key == 1 && game_state == "Play") {
        now = Date.now()
        time_card.innerText = ((now - snowman_start) / 1000).toFixed(2)
    } else {
        time_card.innerText = ""
    }
    
}

function update() {
    now = Date.now()
    if (Date.now() >= game_end && game_state == "Play") {
        game_state = "End";
        console.log("GAME OVER")
        key = 0;
        title_card = document.getElementById("title")
        title_card.innerText = "GAME OVER!";
        score_card = document.getElementById("score")
        score_card.style.color = "red";

    }

    deleteSnowflakes()
}

setInterval(addSnowflake, 100);

// Player input

document.addEventListener('keypress', (e) => {

    if (e.key == ' ' && key == 0) {
        console.log("down");
        key = 1;
        if (game_state == "Start") {
            backgroundMusic();
            document.getElementsByClassName("snowman")[0].remove()
            game_start = Date.now()
            game_end = game_start + gametime();
            game_state = "Play";
            title_card = document.getElementById("title")
            title_card.innerText = "";
            snowman_start = Date.now();
        } else if (game_state == "Play") {
            snowman_start = Date.now();
        }
    }
});

document.addEventListener('keyup', (e) => {

    if (e.key == ' ' && key == 1 && game_state == "Play") {
        snowman_end = Date.now();
        snowman_size = snowmanSize(snowman_end - snowman_start);
        console.log(snowman_end - snowman_start)
        console.log(snowman_size);
        addSnowman(snowman_size);
        key = 0;
    }
});

function addSnowman(size) {
    // Minimum size
    if (size >= minimum_size) {

        score += size / 10;

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
    var new_snowflake = document.createElement('div');
    new_snowflake.className = "snowflake";
    new_snowflake.innerText = "❆";
    new_snowflake.style.opacity = (Math.random() + 0.5);
    new_snowflake.style.left = Math.random() * 100 + "%";
    new_snowflake.style.animation = "snowfall " + (Math.random() * 5 + 5) + "s linear forwards";
    document.body.appendChild(new_snowflake);
}

function deleteSnowflakes() {
    var snowflakes = document.querySelectorAll(".snowflake");
    if (snowflakes.length > 0) {
        snowflakes.forEach((element) => {
            let snowflake_props = element.getBoundingClientRect();
            if (snowflake_props.top >= innerHeight * 0.7 - 1 || game_state != "Play") element.remove();
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