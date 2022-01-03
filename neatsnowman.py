from __future__ import print_function

import os
import pickle

import snowman_actor

import neat
import visualize
from wtj import wtj

runs_per_net = 10
simulation_seconds = 180.0
pop = "hi"
pe = "hi"

class hi():
    _net = "hi"

# from neatsnowman import *


def eval_genome(genome, config):
    runs_per_net = 5
    global nuHi
    net = neat.nn.FeedForwardNetwork.create(genome, config)
    nuHi._net = [genome,config]
    fitnesses = [0]*runs_per_net
    #t = set_interval(doSomething, 60);
    for runs in range(runs_per_net):
        gametime = snowman_actor.SnowmanActor().gametime()
        sim = snowman_actor.SnowmanActor(gameRandomEnd = gametime);
        # Run the given simulation for up to num_steps time steps.
        action = []
        while sim.game_elapsed < sim.game_random_end:
            inputs = sim.inputss()
            action = net.activate(inputs)

            # Apply action to the simulated cart-pole
            sim.act(action)
            
        if (sim.score > 0):
            fitnesses[runs] = sim.score / sim.game_elapsed
        #fitnesses[runs] = sim.key
        #fitnesses.append(fitness)
    #t.stop()
    return sum(fitnesses) / len(fitnesses)

def eval_genomes(genomes, config):
    print("GAMETIME")
    for genome_id, genome in genomes:
        genome.fitness = eval_genome(genome, config)

nuHi = hi()

def run():
    global nuHi
    print("RUN")
    # Load the config file, which is assumed to live in
    # the same directory as this script.
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, 'config')
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_path)

    pop = neat.Population(config)
    print(pop)
    stats = neat.StatisticsReporter()
    pop.add_reporter(stats)
    pop.add_reporter(neat.StdOutReporter(True))

    #pe = neat.ParallelEvaluator(4, eval_genomes)
    #winner = pop.run(pe.evaluate)
    winner = pop.run(eval_genomes, 100)

    # Save the winner.
    with open('winner-feedforward', 'wb') as f:
        pickle.dump(winner, f)

    print(winner)

    wtj();

    visualize.plot_stats(stats, ylog=True, view=True, filename="feedforward-fitness.svg")
    visualize.plot_species(stats, view=True, filename="feedforward-speciation.svg")

    node_names = {-1: 'key', -2: 'game_elapsed', -3: 'snowman_elapsed', 0: 'keydown',1:'keyup'}
    visualize.draw_net(config, winner, True, node_names=node_names)

    visualize.draw_net(config, winner, view=True, node_names=node_names,
                       filename="winner-feedforward.gv")
    visualize.draw_net(config, winner, view=True, node_names=node_names,
                       filename="winner-feedforward-enabled.gv", show_disabled=False)
    visualize.draw_net(config, winner, view=True, node_names=node_names,
                       filename="winner-feedforward-enabled-pruned.gv", show_disabled=False, prune_unused=True)


if __name__ == '__main__':
    run()
