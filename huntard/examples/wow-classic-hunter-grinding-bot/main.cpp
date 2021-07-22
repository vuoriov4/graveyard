#include <iostream>
#include <string>
#include <random>
#include <tchar.h>
#include <time.h>   
#include <cstdlib>
#include <iostream>
#include <windows.h>
#include "Winuser.h"
#include "../../headers/Huntard.h"

using namespace std;
using namespace Huntard;

int patrolIndex = 0;
int pullIndex = 0;

int COMBAT_SLOT =	11;
unsigned short KEY_RANGE =  0x31;
unsigned short KEY_MELEE =	0x32;
unsigned short KEY_PETATTACK = 0x33;
unsigned short KEY_PETFOLLOW = 0x34;
unsigned short KEY_PETMEND = 0x35;
unsigned short KEY_FOOD = 0x36;
unsigned short KEY_TARGET = 0x37;
unsigned short KEY_ASPECT = 0x38;
unsigned short KEY_MARK = 0x39;
unsigned short KEY_STING = 0x30;
unsigned short KEY_PETFEED = VK_OEM_MINUS;

HWND wow;
Image* referenceTarget;
Image* referenceFacingText;
float initialCbtBrightness;

Routine* buff;
Routine* start;
Routine* patrol;
Routine* mend;
Routine* loot;
Routine* pull;
Routine* attack;
Routine* shoot;
Routine* whack;
Routine* turn;
Routine* moveCloser;
Routine* eat;
Routine* escape;

Image* GetSlotImage(int i) {
	int x0 = 39;
	int y0 = 755;
	int x1 = 76;
	int y1 = 792;
	int offset = 89 - 39;
	Image* img = ImageUtils::ImageUtils::Capture(wow, x0 + (i-1)*offset, y0, x1 + offset*(i-1), y1);
	return img;
}

bool GetCombatStatus() {
	Image* cbt = GetSlotImage(COMBAT_SLOT);
	float cbtBrightness = ImageUtils::AvgBrightness(cbt);
	return (initialCbtBrightness - cbtBrightness) / initialCbtBrightness > 0.3;
	delete cbt; 
}

bool GetTargetStatus() {
	Image* target = ImageUtils::Capture(wow, 303, 30, 454, 85);
	ImageUtils::Grayscale(target);
	ImageUtils::Convolve(target, Kernel::VerticalSobel());
	ImageUtils::Radicalize(target, 139);
	float cmp = ImageUtils::DotRad(referenceTarget, target);
	delete target;
	return cmp > -0.075f;
}

float GetHealthStatus() {
	Image* hpbar = ImageUtils::Capture(wow, 110, 58, 244, 64);
	float result = 0.0;
	for (int i = 0; i < hpbar->width * hpbar->height * 4; i += 4) {
		float grey = ((float)hpbar->bytes[i + 0] + (float)hpbar->bytes[i + 1] + (float)hpbar->bytes[i + 2]) / 3.0;
		bool isGreen = hpbar->bytes[i + 1] > hpbar->bytes[i + 0] && hpbar->bytes[i + 1] > hpbar->bytes[i + 2];
		if (abs(grey - hpbar->bytes[i + 1]) > 32 && isGreen) {
			result += 1.0;
		} 
	}
	delete hpbar;
	return 100.0 * result / 804.0;
}

bool GetRangeStatus() {
	Image* one = ImageUtils::Capture(wow, 65, 752, 70, 765);
	float red = 0.0f;
	for (int i = 0; i < one->width * one->height * 4; i += 4) {
		red -= 0.75 * one->bytes[i + 0] / (255 * (float) one->width * (float) one->height);
		red -= 0.75 * one->bytes[i + 1] / (255 * (float) one->width * (float) one->height);
		red += 1.0 * one->bytes[i + 2] / (255 * (float) one->width * (float) one->height);
	}
	delete one;
	return red < 0.0f;
}

bool GetMeleeRangeStatus() {
	return true;
}

float GetEnemyHealthStatus() {
	Image* hpbar = ImageUtils::Capture(wow, 309, 59, 444, 65);
	float result = 0.0;
	for (int i = 0; i < hpbar->width * hpbar->height * 4; i += 4) {
		float grey = ((float)hpbar->bytes[i + 0] + (float)hpbar->bytes[i + 1] + (float)hpbar->bytes[i + 2]) / 3.0;
		bool isGreen = hpbar->bytes[i + 1] > hpbar->bytes[i + 0] && hpbar->bytes[i + 1] > hpbar->bytes[i + 2];
		if (abs(grey - hpbar->bytes[i + 1]) > 32 && isGreen) {
			result += 1.0;
		}
	}
	delete hpbar;
	return 100.0* result / 804.0;
}

float GetPetHealthStatus() {
	Image* hpbar = ImageUtils::Capture(wow, 130, 106, 207, 110);
	float result = 0.0;
	for (int i = 0; i < hpbar->width * hpbar->height * 4; i += 4) {
		float grey = ((float)hpbar->bytes[i + 0] + (float)hpbar->bytes[i + 1] + (float)hpbar->bytes[i + 2]) / 3.0;
		bool isGreen = hpbar->bytes[i + 1] > hpbar->bytes[i + 0] && hpbar->bytes[i + 1] > hpbar->bytes[i + 2];
		if (abs(grey - hpbar->bytes[i + 1]) > 32 && isGreen) {
			result += 1.0;
		}
	}
	delete hpbar;
	return 100.0 * result / 300.0;
}

bool GetFacingStatus() {
	Image* facingText = ImageUtils::Capture(wow, 498, 147, 783, 168);
	ImageUtils::Grayscale(facingText);
	ImageUtils::Convolve(facingText, Kernel::Laplace());
	ImageUtils::Radicalize(facingText, 80);
	ImageUtils::CopyToClipboard(facingText);
	float cmp = ImageUtils::DotRad(referenceFacingText, facingText);
	delete facingText;
	return cmp > 0.05;
}

void ScreenShot() {
	Image* img = ImageUtils::ImageUtils::Capture(wow, 0, 0, 1280, 800);
	ImageUtils::CopyToClipboard(img);
	delete img;
}

void CreateRoutines() {
	// --- BUFF ---
	buff = new Routine;
	buff->name = "Buff";
	buff->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 50, KEY_ASPECT },
			new Action{ wow, ActionType::Wait, 1500 },
		};
	};
	buff->resolve = [&]() {
		return start;
	};
	// --- START ---
	start = new Routine;
	start->name = "Start";
	start->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::Wait, 100 },
		};
	};
	start->resolve = [&]() {
		bool inCombat = GetCombatStatus();
		if (inCombat) return attack;
		float hp = GetHealthStatus();
		if (hp < 50) return eat;
		bool lowPetHp = GetPetHealthStatus() < 50.0f;
		if (lowPetHp) return mend;
		bool targeting = GetTargetStatus();
		if (targeting) return pull;
		return patrol;
	};
	// --- PATROL ---
	patrol = new Routine;
	patrol->name = "Patrol";
	patrol->actions = [&]() {
		patrolIndex++; patrolIndex %= 9;
		if (patrolIndex % 9 == 0) return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 3000, 'W' },
			new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
			//new Action{ wow, ActionType::RightClick, 50 }, // just in case can loot
			new Action{ wow, ActionType::Wait, 50 }
		};
		else return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 225, 'A' },
			new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
			//new Action{ wow, ActionType::RightClick, 50 }, // just in case can loot
			new Action{ wow, ActionType::Wait, 50 }
		};
	};
	patrol->resolve = [&]() {
		return start;
	};
	// --- PULL ---
	pull = new Routine;
	pull->name = "Pull";
	pull->actions = [&]() {
		bool inRange = GetRangeStatus();
		if (inRange) {
			pullIndex = 0;
			return std::vector<Action*> {
				new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
				new Action{ wow, ActionType::KeyPress, 50, KEY_STING },
				new Action{ wow, ActionType::KeyPress, 50, KEY_RANGE },
				new Action{ wow, ActionType::KeyPress, 50, KEY_PETATTACK },
				new Action{ wow, ActionType::Wait, 1500 }
			};
		}
		pullIndex++;
		if (pullIndex == 1) {
			return std::vector<Action*> {
				new Action{ wow, ActionType::KeyPress, 50, KEY_MARK },
				new Action{ wow, ActionType::KeyPress, 750, 'W' },
				new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
				new Action{ wow, ActionType::Wait, 750 },
			};
		}
		return std::vector<Action*> {
			new Action { wow, ActionType::KeyPress, 750, 'W' },
			new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
		};
	};
	pull->resolve = [&]() {
		return start;
	};
	// --- ATTACK ---
	attack = new Routine;
	attack->name = "Attack";
	attack->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::Wait, 50 },
		};
	};
	attack->resolve = [&]() {
		bool inCombat = GetCombatStatus();
		if (!inCombat) return loot;
		//printf("pet health: %f\n", GetPetHealthStatus());
		//printf("player health: %f\n", GetHealthStatus());
		bool emergency = GetHealthStatus() < 25.0;
		if (emergency) return escape;
		bool inRange = GetRangeStatus();
		if (inRange) return shoot;
		return whack;
	};
	// --- SHOOT ---
	shoot = new Routine;
	shoot->name = "Shoot";
	shoot->actions = [&]() {
		bool lowPetHp = GetPetHealthStatus() < 30.0f;
		bool lowEnemyHp = GetEnemyHealthStatus() < 40.0f;
		//printf("enemy health: %f\n", GetEnemyHealthStatus());
		bool targeting = GetTargetStatus();
		if (targeting)
			return std::vector<Action*> {
				new Action{ wow, ActionType::KeyPress, 50, (lowPetHp || lowEnemyHp) ? KEY_PETFOLLOW : KEY_PETATTACK },
				new Action{ wow, ActionType::KeyPress, 50, KEY_RANGE },
				new Action{ wow, ActionType::Wait, 1000 },
			};
		else 
			return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 50, (lowPetHp || lowEnemyHp) ? KEY_PETFOLLOW : KEY_PETATTACK },
				new Action{ wow, ActionType::KeyPress, 50, KEY_TARGET },
				new Action{ wow, ActionType::KeyPress, 50, KEY_RANGE },
				new Action{ wow, ActionType::Wait, 1000 },
			};
	};
	shoot->resolve = [&]() {
		bool facingWrongWay = GetFacingStatus();
		if (facingWrongWay) return turn;
		return attack;
	};
	// --- WHACK --- 
	whack = new Routine;
	whack->name = "Whack";
	whack->actions = [&]() {
		float petHp = GetPetHealthStatus();
		bool lowPetHp = petHp < 25.0f && petHp > 1.0f;
		if (lowPetHp) {
			return std::vector<Action*> {
				new Action{ wow, ActionType::KeyPress, 50, KEY_PETATTACK },
				new Action{ wow, ActionType::KeyPress, 50, KEY_PETMEND },
				new Action{ wow, ActionType::Wait, 5000 }
			};
		} 
		bool lowEnemyHp = GetEnemyHealthStatus() < 30.0f;
		if (lowEnemyHp) {
			return std::vector<Action*> {
				new Action{ wow, ActionType::KeyPress, 50, KEY_PETATTACK },
				new Action{ wow, ActionType::KeyPress, 50, KEY_MELEE },
				new Action{ wow, ActionType::Wait, 1000 },
				new Action{ wow, ActionType::KeyPress, 600, 'S' },
				new Action{ wow, ActionType::KeyPress, 50, KEY_PETFOLLOW },
				new Action{ wow, ActionType::Wait, 1000 },
			};
		}
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 50, KEY_PETATTACK },
			new Action{ wow, ActionType::KeyPress, 50, KEY_MELEE },
			new Action{ wow, ActionType::Wait, 1000 },
			new Action{ wow, ActionType::KeyPress, 600, 'S' },
		};
	};
	whack->resolve = [&]() {
		//bool facingWrongWay = GetFacingStatus();
		//if (facingWrongWay) return turn;
		return attack;
	};
	// --- TURN ---
	turn = new Routine;
	turn->name = "Turn";
	turn->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 200, 'A' },
		};
	};
	turn->resolve = [&]() {
		return attack;
	};
	// --- EAT ---
	eat = new Routine;
	eat->name = "Eat";
	eat->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 200, KEY_FOOD },
			new Action{ wow, ActionType::Wait, 10000 }
		};
	};
	eat->resolve = [&]() {
		return patrol;
	};
	// --- MEND ---
	mend = new Routine;
	mend->name = "Mend";
	mend->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 50, KEY_PETFEED },
			new Action{ wow, ActionType::KeyPress, 50, KEY_FOOD },
			new Action{ wow, ActionType::KeyPress, 50, KEY_PETMEND },
			new Action{ wow, ActionType::Wait, 10100 }
		};
	};
	mend->resolve = [&]() {
		return start;
	};
	// --- LOOT ---
	loot = new Routine;
	loot->name = "Loot";
	loot->actions = [&]() {
		int n = 3; int m = 3; int r = 30;
		int prevDx = 0; int prevDy = 0;
		std::vector<Action*> result;
		result.push_back(new Action{ wow, ActionType::KeyPress, 600, 'W' });
		result.push_back(new Action{ wow, ActionType::KeyPress, 100, 'A'});
		for (int i = 0; i <= n; i++) {
			for (int j = 0; j <= m; j++) {
				int dx = floor(2 * r * ((float)i / (float)n) - r);
				int dy = floor(2 * r * ((float)j / (float)m) - r);
				result.push_back(new Action{ wow, ActionType::MoveMouse, NULL, NULL, dx, dy });
				result.push_back(new Action{ wow, ActionType::RightClick, 50 });
				result.push_back(new Action{ wow, ActionType::Wait, 50 });
				result.push_back(new Action{ wow, ActionType::MoveMouse, NULL, NULL, -dx, -dy });
				result.push_back(new Action{ wow, ActionType::Wait, 100 });
			}
		}
		return result;
	};
	loot->resolve = [&]() {
		bool lowPetHp = GetPetHealthStatus() < 50.0f;
		if (lowPetHp) return mend;
		else return start;
	};
	// --- MOVE CLOSER ---
	moveCloser = new Routine;
	moveCloser->name = "Move Closer";
	moveCloser->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 500, 'W' }
		};
	};
	moveCloser->resolve = [&]() {
		return attack;
	};
	// --- ESCAPE ---
	escape = new Routine;
	escape->name = "Escape";
	escape->actions = [&]() {
		return std::vector<Action*> {
			new Action{ wow, ActionType::KeyPress, 800, 'D' },
			new Action{ wow, ActionType::KeyPress, 10000, 'W' },
			new Action{ wow, ActionType::KeyPress, 50, KEY_FOOD },
			new Action{ wow, ActionType::Wait, 5000 },
			new Action{ wow, ActionType::KeyPress, 800, 'A' },
			new Action{ wow, ActionType::KeyPress, 5000, 'W' }
		};
	};
	escape->resolve = [&]() {
		return mend;
	};
}

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
{
	if (!IsWindowVisible(hwnd)) return TRUE;
	std::wstring str;
	TCHAR* buffer = new TCHAR[18];
	SendMessage(hwnd, WM_GETTEXT, 18, (LPARAM)(void*)buffer);
	const TCHAR* wowc = _T("World of Warcraft");
	bool match = true;
	for (int i = 0; i < 18; i++) {
		if (buffer[i] != wowc[i]) match = false;
	}
	if (match) wow = hwnd;
	return !match;
}

void FindWindowHandle() {
	EnumWindows(EnumWindowsProc, NULL);
}

void Initialize() {
	Image* initialCbt = GetSlotImage(COMBAT_SLOT);
	initialCbtBrightness = ImageUtils::AvgBrightness(initialCbt);
	delete initialCbt;
	referenceTarget = ImageUtils::ReadBitmap("examples/wow-classic-hunter-grinding-bot/target.bmp");
	ImageUtils::Grayscale(referenceTarget);
	ImageUtils::Convolve(referenceTarget, Kernel::VerticalSobel());
	ImageUtils::Radicalize(referenceTarget, 139);
	referenceFacingText = ImageUtils::ReadBitmap("examples/wow-classic-hunter-grinding-bot/facing.bmp");
	ImageUtils::Grayscale(referenceFacingText);
	ImageUtils::Convolve(referenceFacingText, Kernel::Laplace());
	ImageUtils::Radicalize(referenceFacingText, 80);
}

int main() {
	FindWindowHandle();
	ShowWindow(wow, SW_RESTORE);
	SetForegroundWindow(wow);
	Sleep(1000);
	Initialize();
	CreateRoutines();
	Huntard::Start(buff);
	return 0;
}
