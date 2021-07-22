#pragma once
#include "./ActionType.h"

namespace Huntard {
	struct Action {
		HWND windowHandle;
		ActionType type;
		int duration;
		unsigned short code;
		int dx;
		int dy;
	};
}
