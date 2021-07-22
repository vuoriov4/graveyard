let location = 0;

let root = null;

export const locations = { MENU: 0, GAME: 1 };

export const setLocation = (l) => {
	location = l;
	if (root !== null) root.$forceUpdate();
};

export const getLocation = () => { return location; };

export const setRoot = (r) => {
	root = r
};
