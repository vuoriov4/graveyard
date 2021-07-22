#include <vector>
#include <algorithm>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

Rectifier::Rectifier(vector<int> inputDim) {
	this->inputDim = inputDim;
	int activationSize = 1;
	for (int i = 0; i < inputDim.size(); i++) activationSize *= inputDim[i];
	this->activation.resize(activationSize, 0.0);
	int parameterSize = 1;
	for (int i = 0; i < inputDim.size(); i++) parameterSize *= inputDim[i];
	this->parameters.resize(parameterSize, 0.0);
}

void Rectifier::evaluate() {
	assert(this->inputs.size() == 1);
	assert(this->inputs[0]->activation.size() == this->activation.size());
	for (int i = 0; i < this->activation.size(); i++) {
		double offset = this->parameters[i];
		this->activation[i] = max(0.0, this->inputs[0]->activation[i] + offset);
	}
}