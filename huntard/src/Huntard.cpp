#pragma warning(disable : 4996) //_CRT_SECURE_NO_WARNINGS
#include <stdint.h>
#include <iostream>
#include <functional>
#include <string>
#include <algorithm>
#include <vector>
#include <windows.h>
#include <iomanip>
#include <tchar.h>
#include "../headers/Routine.h"
#include "../headers/Action.h"
#include "../headers/ActionType.h"
#include "../headers/ActionDispatcher.h"
#include "../headers/Image.h"
#include "../headers/Huntard.h"

using namespace std;

namespace Huntard {
	void Start(Routine* routine)
	{
		Routine* r;
		while (1) {
			r = routine;
			while (1) {
				cout << "'" << r->name << "'" << endl;
				if (r->actions != NULL) {
					auto as = r->actions();
					for (size_t j = 0; j < as.size(); j++) {
						Action* a = as[j];
						if (a->type == ActionType::Wait) {
							cout << "\tWait\t\t" << a->duration << "ms" << endl;
							Sleep(a->duration);
						}
						else if (a->type == ActionType::KeyPress) {
							cout << "\tKeyPress\t" << a->duration << "ms" << "\t" << a->code << endl;
							ActionDispatcher::PressKey(a->windowHandle, a->code, a->duration);
						}
						else if (a->type == ActionType::RightClick) {
							cout << "\tRightClick\t" << a->duration << "ms" << endl;
							ActionDispatcher::RightClick(a->windowHandle, a->duration);
						}
						else if (a->type == ActionType::MoveMouse) {
							cout << "\tMouseMove\t" << "dx=" << a->dx << "\t" << "dy=" << a->dy << endl;
							ActionDispatcher::MoveMouse(a->windowHandle, a->dx, a->dy);
						}
					}
				}
				if (r->resolve == NULL) {
					r->t++;
					break;
				}
				else {
					r = r->resolve();
					r->t++;
				}
			}
		}
	}
};
