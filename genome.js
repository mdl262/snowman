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
