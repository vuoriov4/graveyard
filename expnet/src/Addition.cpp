#include <vector>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;
	
Addition::Addition(vector<int> inputDim) {
	this->inputDim = inputDim;
	int activationSize = 1;
	for (int i = 0; i < inputDim.size(); i++) activationSize *= inputDim[i];
	this->activation.resize(activationSize, 0.0);
}

void Addition::evaluate() {
	for (int i = 0; i < this->activation.size(); i++) {
		this->activation[i] = 0.0;
		for (int j = 0; j < this->inputs.size(); j++) {
			assert(this->inputs[j]->activation.size() == this->activation.size());
			this->activation[i] += this->inputs[j]->activation[i];
		}
	}
}