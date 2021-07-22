#include <vector>
#include <random>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Distribution;

Constant::Constant(double value) {
	this->value = value;
}

double Constant::sample() {
	return this->value;
}