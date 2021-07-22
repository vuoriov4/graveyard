#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

QuadraticLoss::QuadraticLoss(vector<int> inputDim) {
	this->inputDim = inputDim;
	this->activation.resize(1, 0.0);
	int activationPartialSize = 1;
	for (int i = 0; i < inputDim.size(); i++) activationPartialSize *= inputDim[i];
	this->activationPartials.resize(1);
	this->activationPartials[0].resize(activationPartialSize, 0.0);
}

void QuadraticLoss::evaluate() {
	assert(this->inputs.size() == 2);
	assert(this->inputs[0]->activation.size() == this->inputs[1]->activation.size());
	double sum = 0.0;
	for (int i = 0; i < this->inputs[0]->activation.size(); i++) {
		sum += (this->inputs[0]->activation[i] - this->inputs[1]->activation[i]) * (this->inputs[0]->activation[i] - this->inputs[1]->activation[i]);
	}
	this->activation[0] = 0.5 * sum;
}

void QuadraticLoss::differentiate() {
	for (int i = 0; i < activationPartials[0].size(); i++) {
		this->activationPartials[0][i] = this->inputs[0]->activation[i] - this->inputs[1]->activation[i];
	}
}