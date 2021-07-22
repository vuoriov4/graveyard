#pragma once
#include <string>
#include <vector>
#include <functional>
#include "./Action.h"

namespace Huntard {
	struct Routine {
		std::string name;
		std::function<std::vector<Action*>(void)> actions = NULL;
		std::function<Routine*(void)> resolve = NULL;
		int t = 0;
	};
}
