#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

Downsample::Downsample(vector<int> inputDim, int radius) {
	this->inputDim = inputDim;
	this->radius = radius;
	int activationSize = 1;
	for (int i = 0; i < inputDim.size(); i++) {
		assert(inputDim[i] % (1 + 2 * radius) == 0);
		activationSize *= inputDim[i] / (1 + 2 * radius);
	}
	this->activation.resize(activationSize, 0.0);
	int parameterSize = 1;
	for (int i = 0; i < inputDim.size(); i++) parameterSize *= inputDim[i] / (1 + 2 * radius);
	parameterSize *= pow((double)2 * radius + 1, inputDim.size());
	this->parameters.resize(parameterSize, 0.0);
}

void Downsample::evaluate() {
	int convSize = pow(1.0 + (double)2 * this->radius, inputDim.size());
	assert(this->inputs.size() == 1 && this->inputs[0]->activation.size() == this->activation.size() * convSize);
	for (int j = 0; j < this->activation.size(); j++) {
		int paramStartIndex = j * convSize;
		this->activation[j] = 0.0;
		vector<int> neighbors = Node::neighbors(j, this->radius, this->inputDim);
		for (int k = 0; k < convSize; k++) {
			this->activation[j] += this->parameters[paramStartIndex + k] * this->inputs[0]->activation[neighbors[k]];
		}
	}

}