class Genome {
    constructor() {
        // Game properties
        //this.time_step = 0.033;
        this.game_max_seconds = 10;
        this.minimum_size = 100;
        this.game_random_end = 0;
        this.game_elapsed = 0;

        // Actor properties
        this.champion = false;
        this.score = 0;
    
        // Actor state
        this.snowman_elapsed = 0;
        this.snowman_size = 0;
        this.key = 0;

    }

    show() {
    }

    paintNet() {

        //document.getElementById("nn").contentDocument.querySelector("svg").innerHTML

        let netSvg = document.getElementById("nn").contentDocument || document.getElementById("nn").contentWindow.document
        if (netSvg == null) return

        let nodes = {}
        netSvg.querySelectorAll(".node").forEach(e => {
            let temp = e.querySelector("text").innerHTML
            nodes[temp] = e.id
        });
        //let links = []
        //netSvg.querySelectorAll(".edge title").forEach(e => {
        //    links.push(e.innerHTML)
        //    document.getElementById("nn").contentWindow.document.querySelectorAll(".edge title")[1].textContent
        //});

        // paint nodes
        let values = brain.getValues()
        Object.keys(values).forEach(id => {
            let temp
            id = Number(id)
            switch (id) {
                case -1:
                    temp = "key"
                    break
                case -2:
                    temp = "game_elapsed"
                    break
                case -3:
                    temp = "snow_elapsed"
                    break
                case 0:
                    temp = "keydown"
                    break
                case 1:
                    temp = "keyup"
                    break
                default:
                    temp = id
                    break
            }
            // "key" -> ("-1" ->) "node1"
            if (nodes[temp] != null) {
                netSvg.querySelector("#" + nodes[temp] + " ellipse").style.fill = this.redWhiteBlue(values[id]*100)
            }
        })

        // paint connections
    }

    redWhiteBlue(value) {
        if (value < 0) {
            return this.mix("ff0000","ffffff",-value)
        }
        if (value >= 0) {
            return this.mix("0000ff", "ffffff", value)
        }
    }

    mix(color_1, color_2, weight) {
        // from Jed Foster https://gist.github.com/jedfoster/7939513
        function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
        function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal

        weight = (typeof (weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

        var color = "#";

        for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
            var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
                v2 = h2d(color_2.substr(i, 2)),

                // combine the current pairs from each source color, according to the specified weight
                val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

            while (val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit

            color += val; // concatenate val to our new color string
        }
        return color; // PROFIT!
    };

    up() {
        if (this.key == 1) {
            console.log("AI up")
            this.snowman_size = snowmanSize(this.snowman_elapsed);

            if (this.snowman_size >= this.minimum_size) {
                addSnowman(this.snowman_size)
                this.score = score
            }
            this.snowman_size = 0;
            this.key = 0;
        }
    }

    down() {
        if (this.key == 0) {
            console.log("AI down")
            this.key = 1;
            this.snowman_elapsed = 0;
        }
        
    }

    act(action, real_game_elapsed) {
        if (action[0] > 0.5) this.down()
        else if (action[1] > 0.5) this.up()

        this.paintNet()

        if (this.key == 1) {
            this.snowman_elapsed += (real_game_elapsed - this.game_elapsed)
        }
        this.game_elapsed = real_game_elapsed
    }

    inputss() {
        let inputs = [];
        inputs = inputs.concat(this.key);
        // key state
        inputs = inputs.concat((this.game_elapsed) / (game_max_seconds)); 
        // elapsed game time
        inputs = inputs.concat((this.snowman_elapsed) / (game_max_seconds));
        // elapsed snowman time
        return inputs;
    }



}
