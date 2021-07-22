#define STB_IMAGE_IMPLEMENTATION
#include <iostream>
#include <string>
#include <filesystem>
#include <algorithm>
#include <random>
#include <vector>
#include "assert.h"
#include "stb_image.h"
#include "Expnet.h"
using namespace std;
using namespace std::filesystem;
using namespace Expnet;

vector<double> loadImage(const char* filename) {
    int width, height, bpp;
    uint8_t* rgb_Texture = stbi_load(filename, &width, &height, &bpp, 3);
    assert(width * height > 0);
    vector<double> result;
    for (int i = 0; i < width * height * 3; i += 3) {
        double r = (double)rgb_Texture[i + 0];
        double g = (double)rgb_Texture[i + 1];
        double b = (double)rgb_Texture[i + 2];
        double gs = (r + g + b) / (3.0 * 255.0f);
        result.push_back(gs);
    }
    return result;
}

vector<vector<double>> loadImages(std::string folder, int n, int maxImagesPerFolder) {
    assert(n >= 0 && n <= 9);
    vector<vector<double>> result;
    string path = "data/mnist_png/" + folder + "/" + to_string(n);
    for (const auto& entry : filesystem::directory_iterator(path)) {
        vector<double> img = loadImage(entry.path().string().c_str());
        result.push_back(img);
        if (result.size() >= maxImagesPerFolder) break;
    }
    return result;
}

vector<double> label(int i) {
    vector<double> p;
    for (int k = 0; k < 10; k++) p.push_back((k == i ? 1.0 : 0.0));
    return p;
}

void shuffle(vector<vector<double>>& inputData, vector<vector<double>>& outputData) {
    random_device r;
    seed_seq seed{ r(), r(), r(), r(), r(), r(), r(), r() };
    mt19937 g0(seed);
    auto g1 = g0;
    std::shuffle(inputData.begin(), inputData.end(), g0);
    std::shuffle(outputData.begin(), outputData.end(), g1);
}

void test(Node::Node* inputNode, Node::Node* outputNode) {
    // Testing
    vector<vector<double>> testInput;
    vector<int> testOutput;
    for (int i = 0; i < 10; i++) {
        vector<vector<double>> images = loadImages("testing", i, 1);
        testInput.insert(testInput.end(), images.begin(), images.end());
        for (int j = 0; j < images.size(); j++) testOutput.push_back(i);
    }
    int corrects = 0;
    for (int i = 0; i < testInput.size(); i++) {
        inputNode->propagate(testInput[i]);
        vector<double> result = vector<double>(outputNode->activation);
        int rmax = 0;
        for (int j = 0; j < 10; j++) {
            if (result[j] > result[rmax]) rmax = j;
        }
        if (testOutput[i] == rmax) corrects++;
    }
    printf("%d/%d = %.0f%% images classified correctly.\n", corrects, (int)testInput.size(), 100.0f * (double)corrects / testInput.size());
}

int main() {
    std::cout << "Hello World!\n";
    auto input = new Node::Input(vector<int>{9});
    auto distr = new Distribution::Constant(1.0);
    auto l1 = new Node::Convolution(vector<int>{9}, 1);
    auto loss = new Node::QuadraticLoss();
    auto target = new Node::Input(vector<int>{9});
    l1->init(distr);
    input->connect(l1);
    l1->connect(loss);
    target->connect(loss);
    input->propagate(vector<double>{0, 1, 0, 1, 0, 1, 0, 1, 0});
    target->propagate(vector<double>{0, 0, 1, 0, 1, 0, 1, 0, 1});
    loss;
}

int main_2() {
    std::cout << "Hello World!\n";
    // Nodes
    auto input = new Node::Input(vector<int>{28, 28});
    auto l1 = new Node::Convolution(vector<int>{28, 28}, 2);
    auto r1 = new Node::Rectifier(vector<int>{28, 28});
    auto l2 = new Node::Downsample(vector<int>{28, 28}, 3);
    auto r2 = new Node::Rectifier(vector<int>{4, 4});
    auto l3 = new Node::LinearMap(vector<int>{4, 4}, vector<int>{4, 4});
    auto r3 = new Node::Rectifier(vector<int>{4, 4});
    auto l4 = new Node::LinearMap(vector<int>{4, 4}, vector<int>{10});
    auto output = new Node::Softmax(vector<int>{10});
    auto labels = new Node::Input(vector<int>{10});
    auto loss = new Node::CrossEntropy();
    // Connections
    input->connect(l1);
    l1->connect(r1);
    r1->connect(l2);
    l2->connect(r2);
    r2->connect(l3);
    l3->connect(r3);
    r3->connect(l4);
    l4->connect(output);
    labels->connect(loss);
    output->connect(loss);
    // Load image data and labels
    vector<vector<double>> inputData;
    vector<vector<double>> labelData;
    printf("Loading ~10 images from the MNIST dataset...\n");
    for (int i = 0; i < 10; i++) {
        printf("%d\%%\n", i * 10);
        vector<vector<double>> images = loadImages("training", i, 1);
        inputData.insert(inputData.end(), images.begin(), images.end());
        for (int j = 0; j < images.size(); j++) {
            labelData.push_back(label(i));
        };
    }
    // Training
    int iterations = 10;
    for (int i = 0; i < iterations; i++) {
        int t0 = time(NULL);
        shuffle(inputData, labelData);
        input->propagate(inputData);
        printf("Finished iteration %d/%d\n", i, iterations);
        test(input, output);
        int t1 = time(NULL);
        printf("Elapsed time: %d seconds\n\n", t1 - t0);
    }
    // Testing
    test(input, output);
    return 0;
}
