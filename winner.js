const winner = JSON.parse('{"0": {"bias": -0.10889858216708868, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"-2": 2.5491396573719953, "-3": -5.548152659372325}, "inputs": []}, "1": {"bias": 0.4522769860538697, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"836": -2.5845165197868964}, "inputs": []}, "499": {"bias": 0.7904216950111845, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"1318": 1.959697559529609}, "inputs": []}, "689": {"bias": 1.4948931345901615, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"1411": -0.5427462745130822}, "inputs": []}, "836": {"bias": -0.5817320414107516, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"689": -0.7369278907814785}, "inputs": []}, "1318": {"bias": -3.3040672783633367, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"1610": 0.2671310468429304}, "inputs": []}, "1411": {"bias": -1.0411695362999303, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"-2": 0.28700384597581485, "1610": 0.5845306735223484}, "inputs": []}, "1563": {"bias": -0.6086730672966841, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"1803": 0.46289566234414903}, "inputs": []}, "1610": {"bias": -0.23764480676693134, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"0": -0.17929388603063046, "-1": 0.6464857827548095}, "inputs": []}, "1803": {"bias": -0.07202976636170721, "response": 1.0, "activation": "tanh", "aggregation": "sum", "weights": {"-2": 0.8375209556367723}, "inputs": []}, "-2": {"bias": null, "response": null, "activation": null, "aggregation": null, "weights": {}}, "-3": {"bias": null, "response": null, "activation": null, "aggregation": null, "weights": {}}, "-1": {"bias": null, "response": null, "activation": null, "aggregation": null, "weights": {}}, "order": [0, 1610, 1411, 689, 836, 1]}')
class Brain {
    constructor(json) {
        this.neurons = {}
        let neuron
        for (neuron in json) {
            if (neuron != "order") {
                this.neurons[neuron] = new Node2(json[neuron]["bias"], json[neuron]["weights"], json[neuron]["inputs"])
            } else {
                this.order = json['order']
            }
        }
    }


    getOutputs() {
        return [this.neurons[0].val, this.neurons[1].val]
    }

    tanhActivation(z) {
        z = Math.max(-60.0, Math.min(60.0, 2.5 * z))
        return Math.tanh(z)
    }


    getValues() {
        let out = {}
        let neuron_id
        for (neuron_id in this.neurons) {
            out[neuron_id] = this.neurons[neuron_id].val
        }
        return out
    }

    activate(inputs) {
        for (let input_index = 0; input_index < 3; input_index++) {
            if (Object.keys(this.neurons).includes(String(-input_index - 1))) {
                this.neurons[-input_index - 1].val = inputs[input_index]
            }
        }
        
        this.order.forEach((neuron_id, i) => {
            let node_inputs = []

            for (const [i, w] of Object.entries(this.neurons[neuron_id].w)) {
                node_inputs = node_inputs.concat(this.neurons[i].val * w)
            }

            let s = 0
            if (node_inputs.length > 0) {
                s = node_inputs.reduce((a, b) => a + b)
            }
            this.neurons[neuron_id].val = this.tanhActivation(this.neurons[neuron_id].b + s)
            
        });

        return [this.neurons[0].val, this.neurons[1].val]
    }

}

class Node2 {
    constructor(b = 0, w = {}, i = []) {
        this.val = 0;
        this.b = b
        this.w = w
        this.i = i
    }
}

brain = new Brain(winner)

