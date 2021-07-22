#include <vector>
using namespace std;

namespace Expnet {
	namespace Node {
		class Node;
		class Input;
		class Addition;
		class Multiplication;
		class LinearMap;
		class Convolution;
		class Downsample;
		class Rectifier;
		class Softmax;
		class CrossEntropy;
		class QuadraticLoss;
	}
	namespace Distribution {
		class Distribution;
		class Uniform;
		class Constant;
	}
}

class Expnet::Node::Node {
public:
	virtual void evaluate() = 0;
	virtual void differentiate() = 0;
	void connect(Node* node);
	void init(Distribution::Distribution* distr);
	void propagate(vector<double> data);
	void propagate(vector<vector<double>> batch);
	static vector<int> unravel(int index, vector<int> dimensions);
	static int ravel(vector<int> indices, vector<int> dimensions);
	static vector<int> neighbors(int index, int radius, vector<int> dimensions);
	vector<double> activation;
	vector<double> parameters;
	vector<vector<double>> activationPartials;
	vector<vector<double>> parameterPartials;
	vector<Node*> inputs;
	vector<Node*> outputs;
private:
	void propagate();
	void backPropagate(vector<double> error);
	bool evaluated = false;
};

class Expnet::Node::Input : public Expnet::Node::Node {
public:
	Input(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
};

class Expnet::Node::Multiplication: public Expnet::Node::Node {
public:
	Multiplication(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
};

class Expnet::Node::Addition : public Expnet::Node::Node {
public:
	Addition(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
};

class Expnet::Node::LinearMap : public Expnet::Node::Node {
public:
	LinearMap(vector<int> inputDim, vector<int> outputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
	vector<int> outputDim;
};

class Expnet::Node::Convolution : public Expnet::Node::Node {
public:
	Convolution(vector<int> inputDim, int radius);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
	int radius;
};

class Expnet::Node::Downsample : public Expnet::Node::Node {
public:
	Downsample(vector<int> inputDim, int radius);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
	int radius;
};

class Expnet::Node::Rectifier : public Expnet::Node::Node {
public:
	Rectifier(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
	vector<int> outputDim;
};

class Expnet::Node::Softmax : public Expnet::Node::Node {
public:
	Softmax(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
	vector<int> outputDim;
};

class Expnet::Node::CrossEntropy : public Expnet::Node::Node {
public:
	CrossEntropy(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
};

class Expnet::Node::QuadraticLoss : public Expnet::Node::Node {
public:
	QuadraticLoss(vector<int> inputDim);
	void evaluate();
	void differentiate();
private:
	vector<int> inputDim;
};

class Expnet::Distribution::Distribution {
public:
	virtual double sample() = 0;
};

class Expnet::Distribution::Uniform : public Expnet::Distribution::Distribution {
public:
	Uniform(double a, double b);
	double sample();
private:
	double a;
	double b;
};

class Expnet::Distribution::Constant : public Expnet::Distribution::Distribution {
public:
	Constant(double value);
	double sample();
private:
	double value;
};
