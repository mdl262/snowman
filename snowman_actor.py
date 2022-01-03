import math
from random import random 

class SnowmanActor(object):

    # Game properties
    time_step = 0.033;
    game_max_seconds = 10;
    minimum_size = 100;
    game_random_end = 0;
    game_elapsed = 0;

    # Actor properties
    champion = False;
    score = 0;
    
    # Actor state
    snowman_elapsed = 0;
    snowman_size = 0;
    key = 0;
    

    def __init__(self, gameRandomEnd = 0, champ = False):
        self.champion = champ
        self.game_random_end = gameRandomEnd
        self.game_elapsed = 0;

        # Actor properties
        self.champion = False;
        self.score = 0;
    
        # Actor state
        self.snowman_elapsed = 0;
        self.snowman_size = 0;
        self.key = 0;

    def up(self):
        if (self.key == 1):
            self.snowman_size = self.snowmanSize(self.snowman_elapsed);
            if (self.snowman_size >= self.minimum_size):
                self.addSnowman(self.snowman_size)
            self.snowman_size = 0;
            self.key = 0;

    def down(self):
        if (self.key == 0):
            self.key = 1;
            self.snowman_elapsed = 0;


    def act(self,action):
        if action[0] > 0.5:
            self.down()
        elif action[1] > 0.5: 
            self.up()

        if (self.key == 1): self.snowman_elapsed += 34;
        self.game_elapsed += 34;
        
        
    def inputss(self):
        inputs = [];
        inputs += [self.key];
        # key state
        inputs += [self.game_elapsed / self.game_max_seconds]; 
        # elapsed game time
        inputs += [self.snowman_elapsed / self.game_max_seconds];
        # elapsed snowman time
        return inputs;

    def snowmanSize(self,t) :
        t = t**1.1
        return (t)

    def addSnowman(self,size):
        if (size >= self.minimum_size):
            self.score += size * 100

    def gametime(self) :
        rand = random();
        game_time = (math.log10(10000) * rand) / math.log10(10000)
        game_time = game_time * self.game_max_seconds * 1000;
        return game_time;