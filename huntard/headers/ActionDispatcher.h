#pragma once
#include <windows.h>

namespace Huntard {
	class ActionDispatcher {
	public:
		static void PressKey(HWND windowHandle, WORD code, int ms);
		static void RightClick(HWND windowHandle, int ms);
		static void MoveMouse(HWND windowHandle, int dx, int dy);
	};
}