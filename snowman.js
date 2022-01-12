var snowmen = document.getElementsByClassName("snowman"), // the box
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
    score = 0,
    time = 0,
    delta = 0,
    lastFrameTimeMs = 0,
    maxFPS = 30,
    delta = 0,
    timestep = 1000 / 30;
var final_score
var peer
var conn

// Help menu
document.getElementById("help").addEventListener("click", function (event) {
    alert("\tSingle-player mode:\nPress [1] or [space] to start. Press and hold [space] to make a snowman.\n" +
        "\tAI mode:\nPress [2] to start.\n" +
        "\t2-player local mode:\nPress [3] to start. Player 1 uses [Q], Player 2 uses [P].\n" +
        "\t2-player online mode:\nPress [4] to start.\n" +
        "\tStop game with [Z]."
        )
});


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


function getSnowmanImage(x, player = null) {
    if (game_mode == 2 || game_mode == 3) {
        if (player == 0) {
            x = x % 2 ? 1 : 3;
        } else {
            x = x % 2 ? 2 : 4;
        }
    } else x = x % 4 + 1;
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
    document.querySelector("#nn").style.visibility = "collapse";
    document.querySelector("#score2").style.visibility = "collapse";
    document.querySelector("#score2").style.color = "black";
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
                score = 0,
                time = 0,
                lastFrameTimeMs = 0,
                delta = 0;
            break;
        case 1: // NEAT AI
            key = 0,
                number_of_snowman = 0,
                snowman_start = 0,
                snowman_end = 0,
                snowman_size = 0,
                score = 0,
                time = 0,
                delta = 0,
                lastFrameTimeMs = 0;
            puppet = new Genome();
            puppet.game_random_end = game_end - game_start;
            document.querySelector("#nn").style.visibility = "visible"

            break;
        case 2: // 2-player
            number_of_snowman = [0,0]
            key = [0, 0];
            snowman_start = [0, 0];
            score = [0, 0];
            time = 0;
            delta = 0;
            lastFrameTimeMs = 0;
            document.querySelector("#score2").style.visibility = "visible";
            break;
        case 3:
            document.querySelector(".p2p_wrapper").style.visibility = "visible";
            peer = new Peer()
            peer.on("open", function (id) {
                console.log(id)
            })
            peer.on('connection', function (c) {
                c.on('data', function (data) {
                    //console.log("HOST")
                    // Will print 'this is a test'
                    //console.log(data);
                    if (data["guest"] != null) {
                        conn = peer.connect(data["guest"]);
                        conn.on('open', function () {
                            console.log("HOST-GUEST OPEN")
                            game_start = Date.now() + 3000
                            game_end = game_start + gametime();
                            conn.send({ "game_end": game_end , "game_start":game_start})
                            console.log(game_end)
                            score = [0, 0];
                            game_state = "Countdown"
                        });
                        number_of_snowman = [0, 0]
                        key = [0, 0];
                        snowman_start = [0, 0];
                        time = 0;
                        delta = 0;
                        lastFrameTimeMs = 0;
                        document.querySelector("#score2").style.visibility = "visible";
                        document.querySelector(".p2p_wrapper").style.visibility = "hidden";
                    }
                    if (data["game_end"] != null) {
                        number_of_snowman = [0, 0]
                        key = [0, 0];
                        snowman_start = [0, 0];
                        number_of_snowman = [0, 0]
                        score = [0, 0];
                        time = 0;
                        delta = 0;
                        lastFrameTimeMs = 0;

                        game_mode = 3;
                        backgroundMusic();
                        title_card = document.getElementById("title");
                        title_card.innerText = "";
                        game_start = data["game_start"]
                        game_end = data["game_end"]
                        console.log(game_end)
                        score_card = document.getElementById("score")
                        score_card.style.color = "black";
                        var snowmen = document.querySelectorAll(".snowman");
                        document.querySelector("#nn").style.visibility = "collapse";
                        document.querySelector("#score2").style.visibility = "visible";
                        document.querySelector("#score2").style.color = "black";
                        if (snowmen.length > 0) {
                            snowmen.forEach((element) => {
                                element.remove();
                            });
                        }
                        document.querySelector("#score2").style.visibility = "visible";
                        game_state = "Countdown"
                    }
                    if (data["snowman_start"] != null) snowman_start[1] = data["snowman_start"]
                    if (data["score"] != null) {
                        score[1] = data["score"]
                        //console.log(score)
                    }
                    if (data["key"] != null) {
                        if (data["key"] == 0 && key[1] == 1) {
                            snowman_end = Date.now();
                            snowman_size = snowmanSize(snowman_end - snowman_start[1]);
                            addSnowman(snowman_size, 1);
                        }
                        key[1] = data["key"]
                    }
                    if (data["final_score"] != null) {
                        final_score = data["final_score"]
                    }
                    
                });
            });
            document.querySelector(".p2p_wrapper button").addEventListener("click", function (event) {
                let currentUrl = window.location.href
                var hostUrl = currentUrl.includes("?") ? currentUrl.substring(0, currentUrl.indexOf("?")) : currentUrl
                hostUrl += "?host=" + encodeURI(peer.id)
                navigator.clipboard.writeText(hostUrl)
            })
            game_state = "Connecting"
            break;

    }

}

function getUrlHostId() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return decodeURI(vars["host"]);
}


window.onload = (function(event){
    var host = getUrlHostId()
    if (host != "undefined") {
        peer = new Peer()
        peer.on("open", function (id) {
            conn = peer.connect(host);
            conn.on('open', function () {
                console.log("GUEST-HOST OPEN")
                conn.send({"guest": peer.id})
            });
            
        })
        peer.on('connection', function (conn) {
            conn.on('data', function (data) {
                // Will print 'this is a test'
                if (data["game_end"] != null) {
                    number_of_snowman = [0, 0]
                    key = [0, 0];
                    snowman_start = [0, 0];
                    number_of_snowman = [0,0]
                    score = [0, 0];
                    time = 0;
                    delta = 0;
                    lastFrameTimeMs = 0;

                    game_mode = 3;
                    backgroundMusic();
                    title_card = document.getElementById("title");
                    title_card.innerText = "";
                    game_start = data["game_start"]
                    game_end = data["game_end"]
                    console.log(game_end)
                    score_card = document.getElementById("score")
                    score_card.style.color = "black";
                    var snowmen = document.querySelectorAll(".snowman");
                    document.querySelector("#nn").style.visibility = "collapse";
                    document.querySelector("#score2").style.visibility = "visible";
                    document.querySelector("#score2").style.color = "black";
                    if (snowmen.length > 0) {
                        snowmen.forEach((element) => {
                            element.remove();
                        });
                    }
                    document.querySelector("#score2").style.visibility = "visible";
                    game_state = "Countdown"
                }
                if (data["snowman_start"] != null) snowman_start[1] = data["snowman_start"]
                if (data["score"] != null) {
                    score[1] = data["score"]
                    //console.log(score)
                }
                if (data["key"] != null) {
                    if (data["key"] == 0 && key[1] == 1) {
                        snowman_end = Date.now();
                        snowman_size = snowmanSize(snowman_end - snowman_start[1]);
                        addSnowman(snowman_size, 1);
                    } 
                    key[1] = data["key"]
                }
                if (data["final_score"] != null) {
                    final_score = data["final_score"]
                }
            });
        });
    }
})

//document.addEventListener("click", function(e) {navigator.clipboard.writeText("ASSSSSSSD")})

function stopGameMode() {
    switch (game_mode) {
        case 0:
            score_card = document.getElementById("score")
            score_card.style.color = "red";
            break;
        case 1:
            score_card = document.getElementById("score")
            score_card.style.color = "red"; 
            break;
        case 2:
            score_card = document.getElementById("score")
            score_card.style.color = "red";
            break;

    }
    console.log(score);
    score = 0;
    game_state = "End";
    console.log("GAME OVER");
    key = 0;
    title_card = document.getElementById("title")
    title_card.innerText = "GAME OVER!";

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
    now = Date.now()

    switch (game_mode) {
        case 0:
            if (game_state == "Play") {
                var elapsed_time = ((now - game_start) / 1000).toFixed(2);
                score_card.innerText = "Score: " + (score / elapsed_time).toFixed(2);
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;
                elapsed_card.style.justifyContent = "right"

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
                else time_card.innerText = "";
                elapsed_card.style.justifyContent = "right"
            }
            break;
        case 2:
            if (game_state == "Play") {
                var elapsed_time = ((now - game_start) / 1000).toFixed(2);
                score_card.innerText = "Score: " + (score[0] / elapsed_time).toFixed(2) + "\n" + (Boolean(key[0]) ? ((Date.now() - snowman_start[0]) / 1000).toFixed(2) : "");
                score_card = document.getElementById("score2")
                score_card.innerText = "Score: " + (score[1] / elapsed_time).toFixed(2) + "\n" + (Boolean(key[1]) ? ((Date.now() - snowman_start[1]) / 1000).toFixed(2) : "");
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;
                elapsed_card.style.justifyContent = "center"
                time_card.innerText = ""
            }
            break;
        case 3:
            if (game_state == "Connecting") {
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;
                elapsed_card.style.justifyContent = "center"
                time_card.innerText = ""
            } else if (game_state == "Countdown") {
                let title_card = document.getElementById("title")
                if (Date.now() > game_start) {
                    title_card.innerText = ""
                    game_state = "Play"
                } else if (Date.now() + 1000 > game_start) {
                    title_card.innerText = "1";
                } else if (Date.now() + 2000 > game_start) {
                    title_card.innerText = "2";
                } else title_card.innerText = "3";
            }else if (game_state == "Play") {
                

                conn.send({ "score": score[0], "snowman_start": snowman_start[0], "key": key[0] })
                var elapsed_time = ((now - game_start) / 1000).toFixed(2);
                score_card.innerText = "Score: " + (score[0] / elapsed_time).toFixed(2) + "\n" + (Boolean(key[0]) ? ((Date.now() - snowman_start[0]) / 1000).toFixed(2) : "");
                conn.send({ "final_score": (score[0] / elapsed_time).toFixed(2) })
                score_card = document.getElementById("score2")
                score_card.innerText = "Score: " + (score[1] / elapsed_time).toFixed(2) + "\n" + (Boolean(key[1]) ? ((Date.now() - snowman_start[1]) / 1000).toFixed(2) : "");
                elapsed_card.innerText = "Time elapsed: " + elapsed_time;
                elapsed_card.style.justifyContent = "center"
                time_card.innerText = ""
            } else if (game_state == "End") {
                score_card = document.getElementById("score2")
                score_card.innerText = score_card.innerText.replace("Score: .+\n","Score: "+final_score+"\n")
                //score_card.innerText = "Score: " + final_score + "\n" + (Boolean(key[1]) ? ((Date.now() - snowman_start[1]) / 1000).toFixed(2) : "");
            }
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
            if (Date.now() >= game_end && game_state == "Play") {
                game_state = "End";
                console.log("GAME OVER")
                key = [0,0];
                title_card = document.getElementById("title")
                title_card.innerText = "GAME OVER!";
                score_card = document.getElementById("score")
                score_card.style.color = "red";
                score_card = document.getElementById("score2")
                score_card.style.color = "#00007f";

            }
            break;

        case 3:
            if (Date.now() >= game_end && game_state == "Play") {
                game_state = "End";
                console.log("GAME OVER")
                key = [0,0];
                title_card = document.getElementById("title")
                title_card.innerText = "GAME OVER!";
                score_card = document.getElementById("score")
                score_card.style.color = "red";
                score_card = document.getElementById("score2")
                score_card.style.color = "#00007f";

            }
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
            } else if (e.key == "3" && key == 0) {
                console.log("down");
                startGameMode(2)
                snowman_start = [Date.now(), Date.now()];
                key = [0, 0];
            } else if (e.key == "4" && key == 0) {
                console.log("down");
                startGameMode(3)
                snowman_start = [Date.now(), Date.now()];
                key = [0, 0];
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
                    if (e.key == 'q' && key[0] == 0) {
                        snowman_start[0] = Date.now();
                        key[0] = 1;
                    }
                    if (e.key == 'p' && key[1] == 0) {
                        snowman_start[1] = Date.now();
                        key[1] = 1;
                    }
                    break;
                case 3:
                    if (e.key == ' ' && key[0] == 0) {
                        snowman_start[0] = Date.now();
                        key[0] = 1;
                    }
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
            } else if (e.key == "3" && key == 0) {
                console.log("down");
                startGameMode(2)
                snowman_start = [Date.now(), Date.now()];
                key = [0, 0];
            } else if (e.key == "4") {
                console.log("down");
                game_start = Date.now() + 3000
                game_end = game_start + gametime();
                conn.send({ "game_end": game_end, "game_start": game_start })
                console.log(game_end)
                score = [0, 0];
                var snowmen = document.querySelectorAll(".snowman");
                if (snowmen.length > 0) {
                    snowmen.forEach((element) => {
                        element.remove();
                    });
                }
                game_state = "Countdown"
                snowman_start = [Date.now(), Date.now()];
                key = [0, 0];
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
            if (e.key == 'q' && key[0] == 1 && game_state == "Play") {
                snowman_end = Date.now();
                snowman_size = snowmanSize(snowman_end - snowman_start[0]);
                addSnowman(snowman_size,0);
                key[0] = 0;
            }
            if (e.key == 'p' && key[1] == 1 && game_state == "Play") {
                snowman_end = Date.now();
                snowman_size = snowmanSize(snowman_end - snowman_start[1]);
                addSnowman(snowman_size,1);
                key[1] = 0;
            }
            break;
        case 3:
            if (e.key == ' ' && key[0] == 1 && game_state == "Play") {
                snowman_end = Date.now();
                snowman_size = snowmanSize(snowman_end - snowman_start[0]);
                addSnowman(snowman_size, 0);
                key[0] = 0;
            }
            break;
    }

    
});

function addSnowman(size, player = null) {
    // Minimum size
    if (size >= minimum_size) {

        let snowmen
        switch (game_mode) {
            case 0:
                score += size / 10;
                snowmen = document.querySelectorAll(".snowman");
                break;
            case 1:
                score += size / 10
                snowmen = document.querySelectorAll(".snowman");
                break;
            case 2:
                score[player] += size / 10
                if (player == 0) snowmen = document.querySelectorAll(".snowman.zero");
                else if (player == 1) snowmen = document.querySelectorAll(".snowman.one");
                break;
            case 3:
                if (player == 0) {
                    score[player] += size / 10
                    snowmen = document.querySelectorAll(".snowman.zero");
                }
                else if (player == 1) snowmen = document.querySelectorAll(".snowman.one");
                break;
        }

        size = size * 0.05 // cosmetic scaling

        // Shift all other snowmen
        if (snowmen.length > 0) {
            previous_size = snowmen[snowmen.length - 1].getBoundingClientRect().width;
            snowmen.forEach((element) => {

                let snowmen_props = element.getBoundingClientRect();

                // Delete the snowmen if they have moved out
                // of the screen hence saving memory
                if (snowmen_props.right <= 0 || snowmen_props.left >= innerWidth) {
                    element.remove();
                } else {
                    switch (player) {
                        case 0:
                            element.style.left = (snowmen_props.left - previous_size/ 2 - size / 2 - 10) + "px"
                            break;
                        case 1:
                            element.style.right = (innerWidth - snowmen_props.right - previous_size / 2 - size / 2 - 10) + "px"
                            break;
                        case null:
                            element.style.left = (snowmen_props.left - previous_size / 2 - size / 2 - 10) + "px"
                            break;
                    }
                }
            });

        }

        // Add new snowman
        var new_snowman = document.createElement('div');
        switch (player) {
            case 0:
                new_snowman.className = 'snowman zero';
                new_snowman.style.left = 'calc(30% - ' + size / 2 + 'px)';
                new_snowman.style.backgroundImage = getSnowmanImage(number_of_snowman[0],0);
                number_of_snowman[0]++;
                break;
            case 1:
                new_snowman.className = 'snowman one';
                new_snowman.style.right = 'calc(30% - ' + size / 2 + 'px)';
                new_snowman.style.backgroundImage = getSnowmanImage(number_of_snowman[1],1);
                number_of_snowman[1]++;
                break;
            default:
                new_snowman.className = 'snowman';
                new_snowman.style.left = 'calc(50% - ' + size / 2 + 'px)';
                new_snowman.style.backgroundImage = getSnowmanImage(number_of_snowman);
                number_of_snowman++;
                break;
        }
        new_snowman.style.width = size + 'px';
        new_snowman.style.height = (size * 1.54) + 'px';
        document.body.appendChild(new_snowman);
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