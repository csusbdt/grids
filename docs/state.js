const initial_state = {
	version: '0',
	n: 0
};

let state = null;

g.save_state = () => {
	localStorage.setItem('grids', JSON.stringify(state));
};

g.get_state = () => {
	if (state !== null) return state;
	let state_string = localStorage.getItem('grids');
	if (state_string === null) {
		state = initial_state;
	} else {
		state = JSON.parse(state_string);
		if (!('version' in state)) {
			state = initial_state;
		} else {
			if (state.version !== initial_state.version) {
				state = initial_state;
			}	
		}
	}
	return state;
};

export const get_state = (page, key) => {
	if (page === undefined) {
		return state;
	}
	if (!(page in state)) {
		state[page] = {};
	}
	if (key === undefined) {
		return state[page];
	}
	if (!(key in state[page])) {
		state[page][key] = false;
	}
	return state[page][key];
};

export const set_state = (page, key, value) => {
	if (key === undefined) {
		throw new Error('set_state called without key');
	}
	if (value === undefined) {
		value = true;
	}
	if (!(page in state)) {
		state[page] = {};
	}
	state[page][key] = value;
	save_state();
};

export const get_page = () => {
	return state.page;
};

export const get_page_state = key => {
	const page_state = get_state(get_page());
	if (!(key in page_state)) {
		return false;
	} else {
		return page_state[key];
	}
};

export const set_page_state = (key, value) => {
	if (value === undefined) {
		value = true;
	}
	set_state(get_page(), key, value);
};

export const get_score = () => {
	return state.score;
};

export const get_solved = key => {
	return get_page_state(key);
};

export const set_solved = key => {
	if (!get_solved(key)) {
		--state.score;
		set_page_state(key);
	}
};
