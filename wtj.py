import pandas as pd
import json
import neat

def wtj():

    winner = pd.read_pickle(r"winner-feedforward")

    jsonOut = {}

    _nodes = winner.nodes
    _connections = winner.connections

    for e in _nodes:
        jsonOut[e] = {"bias":_nodes[e].bias,
                    "response":_nodes[e].response,
                    "activation":_nodes[e].activation,
                    "aggregation":_nodes[e].aggregation,
                    "weights":{},
                    "inputs":[]}

    for inkey,outkey in _connections:
        if inkey not in jsonOut:
            jsonOut[inkey] = {"bias":None,
                    "response":None,
                    "activation":None,
                    "aggregation":None,
                    "weights":{}}
        if _connections[(inkey,outkey)].enabled:
            jsonOut[outkey]["weights"][inkey] = _connections[(inkey,outkey)].weight

    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         "config")

    net = neat.nn.FeedForwardNetwork.create(winner, config)
    jsonOut["order"] = [e[0] for e in net.node_evals]

    with open('winner.json','w') as fp:
        json.dump(jsonOut, fp)
    
if __name__ == '__main__':
    wtj()