#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

Softmax::Softmax(vector<int> inputDim) {
	this->inputDim = inputDim;
	int activationSize = 1;
	for (int i = 0; i < inputDim.size(); i++) activationSize *= inputDim[i];
	this->activation.resize(activationSize, 0.0);
	int parameterSize = 1;
	for (int i = 0; i < inputDim.size(); i++) parameterSize *= inputDim[i];
	this->parameters.resize(parameterSize, 0.0);
}

void Softmax::evaluate() {
	assert(this->inputs.size() == 1);
	assert(this->inputs[0]->activation.size() == this->activation.size());
	double sum = 0.0;
	for (int i = 0; i < this->activation.size(); i++) {
		sum += exp(this->inputs[0]->activation[i]);
	}
	for (int i = 0; i < this->activation.size(); i++) {
		this->activation[i] = exp(this->inputs[0]->activation[i]) / sum;
	}
}