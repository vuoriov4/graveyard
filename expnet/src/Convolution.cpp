#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

Convolution::Convolution(vector<int> inputDim, int radius) {
	this->inputDim = inputDim;
	this->radius = radius;
	int activationSize = 1;
	for (int i = 0; i < inputDim.size(); i++) activationSize *= inputDim[i];
	this->activation.resize(activationSize, 0.0);
	int parameterSize = 1;
	for (int i = 0; i < inputDim.size(); i++) parameterSize *= inputDim[i];
	parameterSize *= pow((double) 2 * radius + 1, inputDim.size());
	this->parameters.resize(parameterSize, 0.0);
	this->activationPartials.resize(activationSize);
	for (int i = 0; i < activationSize; i++) this->activationPartials[i].resize(activationSize, 0.0);
	this->parameterPartials.resize(activationSize);
	for (int i = 0; i < activationSize; i++) this->parameterPartials[i].resize(parameterSize, 0.0);
}

void Convolution::evaluate() {
	assert(this->inputs.size() == 1 && this->inputs[0]->activation.size() == this->activation.size());
	for (int j = 0; j < this->activation.size(); j++) {
		int convSize = pow((double) 2 * this->radius + 1, inputDim.size());
		int paramStartIndex = j * convSize;
		this->activation[j] = 0.0;
		vector<int> neighbors = Node::neighbors(j, this->radius, this->inputDim);
		for (int k = 0; k < convSize; k++) {
			this->activation[j] += this->parameters[paramStartIndex + k] * this->inputs[0]->activation[neighbors[k]];
		}
	}
}

void Convolution::differentiate() {
	// w.r.t parameters
	for (int w = 0; w < this->parameters.size(); w++) {
		int i = w / pow((double)2 * radius + 1, inputDim.size());
		for (int j = 0; j < this->activation.size(); j++) {
			if (abs(i - j) <= this->radius) {
				this->parameterPartials[j][w] = this->inputs[0]->activation[j];
			}
			else this->parameterPartials[j][w] = 0.0;
		}
	}
	// w.r.t activation
	for (int i = 0; i < this->activation.size(); i++) {
		int w = 0;
		for (int j = 0; j < this->activation.size(); j++) {
			this->activationPartials[j][i] = this->parameters[w];
		}
	}
}