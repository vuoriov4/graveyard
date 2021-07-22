#include <vector>
#include <algorithm>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

void Node::connect(Node* node) {
	this->outputs.push_back(node);
	node->inputs.push_back(this);
}

void Node::init(Distribution::Distribution* distr) {
	for (int i = 0; i < this->parameters.size(); i++) this->parameters[i] = distr->sample();
}

void Node::propagate(vector<double> data) {
	assert(data.size() == this->activation.size());
	for (int i = 0; i < this->activation.size(); i++) this->activation[i] = data[i];
	this->evaluated = true;
	if (this->outputs.size() > 0) this->outputs[0]->propagate();
}

void Node::propagate(vector<vector<double>> batch) {
	for (int i = 0; i < batch.size(); i++) {
		this->propagate(batch[i]);
	}
}

void Node::propagate() {
	bool ready = true;
	for (const Node* node : this->inputs) ready = ready && node->evaluated;
	if (!ready) return;
	this->evaluate();
	this->evaluated = true;
	if (this->outputs.size() > 0) this->outputs[0]->propagate(false);
	else this->backPropagate();
}

void Node::backPropagate(vector<double> error) {
	if (this->inputs.size() == 0) return;
	else this->inputs[0]->propagate(true);
}

vector<int> Node::unravel(int index, vector<int> dimensions) {
	vector<int> result;
	if (dimensions.size() == 0) return result;
	int mod = dimensions[0];
	int div = 1;
	for (int d = 0; d < dimensions.size(); d++) {
		if (d >= dimensions.size() - 1) {
			result.push_back(index / div);
		} else {
			result.push_back((index % mod) / div);
			mod *= dimensions[d + 1];
			div *= dimensions[d];
		}
	}
	return result;
}

int Node::ravel(vector<int> indices, vector<int> dimensions) {
	assert(indices.size() == dimensions.size());
	int sum = 0;
	int factor = 1;
	for (int i = 0; i < dimensions.size(); i++) {
		sum += indices[i] * factor;
		factor *= dimensions[i];
	}
	return sum;
}

vector<int> Node::neighbors(int index, int radius, vector<int> dimensions) {
	vector<vector<int>> offsets;
	for (int d = 0; d < dimensions.size(); d++) {
		vector<int> offset;
		for (int i = -radius; i <= radius; i++) offset.push_back(i);
		offsets.push_back(offset);
	}
	// cartesian product of offsets
	vector<vector<int>> cart = { {} };
	for (const auto& u : offsets) {
		vector<vector<int>> r;
		for (const auto& x : cart) {
			for (const auto y : u) {
				r.push_back(x);
				r.back().push_back(y);
			}
		}
		cart = move(r);

	}
	// center to index and ravel
	vector<int> result;
	vector<int> rv = Node::unravel(index, dimensions);
	for (int i = 0; i < cart.size(); i++) {
		vector<int> indices;
		for (int j = 0; j < cart[i].size(); j++) {
			int res = max(0, min(dimensions[j] - 1, rv[j] + cart[i][j]));
			indices.push_back(res);
		}
		int idx = Node::ravel(indices, dimensions);
		result.push_back(idx);
	}
	return result;
}