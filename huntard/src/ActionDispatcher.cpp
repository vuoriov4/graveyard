#include "../headers/ActionDispatcher.h"
#include <tchar.h>
#include <dinput.h>
namespace Huntard {
	void ActionDispatcher::PressKey(HWND hWnd, WORD code, int ms) {
		INPUT ip;
		ip.type = INPUT_KEYBOARD;
		KEYBDINPUT ki;
		ki.wScan = 0; // hardware scan code forkey
		ki.time = 0;
		ki.dwExtraInfo = 0;
		ki.wVk = code; // virtual-keycode
		ki.dwFlags = 0;// 0 for key press
		ip.ki = ki;
		SendInput(1, &ip, sizeof(INPUT));
		Sleep(ms);
		ip.ki.dwFlags = KEYEVENTF_KEYUP; //KEYEVENTF_KEYUP for key release
		SendInput(1, &ip, sizeof(INPUT));
	}
	void ActionDispatcher::RightClick(HWND hWnd, int ms) {
		INPUT ip;
		ip.type = INPUT_MOUSE;
		ip.mi.dx = 0;
		ip.mi.dy = 0;
		ip.mi.dwFlags = (MOUSEEVENTF_RIGHTDOWN | MOUSEEVENTF_RIGHTUP);
		ip.mi.mouseData = 0;
		ip.mi.dwExtraInfo = NULL;
		ip.mi.time = 0;
		SendInput(1, &ip, sizeof(INPUT));
		Sleep(ms);
	}
	void ActionDispatcher::MoveMouse(HWND hWnd, int dx, int dy) {
		INPUT input;
		input.type = INPUT_MOUSE;
		input.mi.mouseData = 0;
		input.mi.dx = dx;
		input.mi.dy = dy;
		input.mi.dwFlags = MOUSEEVENTF_MOVE;
		SendInput(1, &input, sizeof(input));
	}
	
}
