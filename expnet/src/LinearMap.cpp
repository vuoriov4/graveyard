#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

LinearMap::LinearMap(vector<int> inputDim, vector<int> outputDim) {
	this->inputDim = inputDim;
	this->outputDim = outputDim;
	int activationSize = 1;
	for (int i = 0; i < outputDim.size(); i++) activationSize *= outputDim[i];
	this->activation.resize(activationSize, 0.0);
	int parameterSize = 1;
	for (int i = 0; i < inputDim.size(); i++) parameterSize *= inputDim[i];
	for (int i = 0; i < outputDim.size(); i++) parameterSize *= outputDim[i];
	this->parameters.resize(parameterSize, 0.0);
}

void LinearMap::evaluate() {
	assert(this->inputs.size() == 1);
	for (int j = 0; j < this->activation.size(); j++) {
		this->activation[j] = 0.0;
		for (int i = 0; i < this->inputs[0]->activation.size(); i++) {
			int paramIndex = i + j * this->inputs[0]->activation.size();
			this->activation[j] += this->parameters[paramIndex] * this->inputs[0]->activation[i];
		}
	}
	
}