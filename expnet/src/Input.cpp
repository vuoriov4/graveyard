#include <vector>
#include "Expnet.h"
using namespace std;
using namespace Expnet::Node;

Input::Input(vector<int> inputDim) {
	this->inputDim = inputDim;
	int activationSize = 1; 
	for (int i = 0; i < inputDim.size(); i++) activationSize *= inputDim[i];
	this->activation.resize(activationSize, 0.0);
}

void Input::evaluate() {
	return;
}

void Input::differentiate() {
	return;
}