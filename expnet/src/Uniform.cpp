#include <vector>
#include <random>
#include "assert.h"
#include "Expnet.h"
using namespace std;
using namespace Expnet::Distribution;

Uniform::Uniform(double a, double b) {
	this->a = a; 
	this->b = b;
}

double Uniform::sample() {
	std::random_device rd;
	static thread_local std::mt19937 generator(rd());
	std::uniform_real_distribution<double> distribution(a, b);
	return distribution(generator);
}