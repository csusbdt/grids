// constants
window.LEFT      = 'l';
window.RIGHT     = 'r';
window.UP        = 'u';
window.DOWN      = 'd';

// run constants
window.number_of_cups = 0;
window.cups_d       = [];
window.cups_s       = [];
window.cups_start_c = [];
window.cups_start_r = [];
window.paths        = new Map();

// run variables
window.solution  = null;
window.box_c     = start_c;
window.box_r     = start_r;
window.cups_c    = [];
window.cups_r    = [];

window.get_state = function() {
	let s = '' + box_c + box_r;
	for (let i = 0; i < number_of_cups; ++i) {
		s = s + cups_c[i] + cups_r[i];
	}
	return s;
}

window.set_state = function(s) {
	let j = 0;
	box_c = parseInt(s.charAt(j++));
	box_r = parseInt(s.charAt(j++));
	cups_c.length = 0;
	cups_r.length = 0;
	for (let i = 0; i < number_of_cups; ++i) {
		cups_c.push(parseInt(s.charAt(j++)));
		cups_r.push(parseInt(s.charAt(j++)));
	}
}

window.at_goal = function() {
	if (box_c !== exit_c || box_r !== exit_r) return false;
	for (let i = 0; i < number_of_cups; ++i) {
		if (cups_c[i] !== exit_c || cups_r[i] !== exit_r) continue;
		if (cups_d[i] !== exit_d) return false;
	}
	return true;
}

window.opposite = function(dir) {
	if (dir === LEFT ) return RIGHT;
	if (dir === RIGHT) return LEFT;
	if (dir === UP   ) return DOWN;
	if (dir === DOWN ) return UP;
	throw new Error();
}

window.can_move = function(c, r) {
	if (c < 0 || c >= cols || r < 0 || r >= rows) {
		return false;
	}
	let dir = null;
	if (box_c === c + 1 && box_r === r) {
		dir = LEFT;
	} else if (box_c === c - 1 && box_r === r) {
		dir = RIGHT;
	} else if (box_c === c && box_r === r + 1) {
		dir = UP;
	} else if (box_c === c && box_r === r - 1) {
		dir = DOWN;
	} else {
		return false;
	}
	for (let i = 0; i < number_of_cups; ++i) {
		if (cups_c[i] === c && cups_r[i] === r && cups_d[i] !== opposite(dir)) {
			return false;
		}
	}
	for (let size = 0; size <= max_cup_size; ++size) {
		for (let i = 0; i < number_of_cups; ++i) {
			if (cups_s[i] !== size) continue;
			if (cups_c[i] !== box_c || cups_r[i] !== box_r) continue;
			if (cups_c[i] === c && cups_r[i] === r && cups_d[i] !== opposite(dir)) {
				return false;
			}
		}
	}
	return true;
}

function move_cup(i, m) {
	if      (m === LEFT ) --cups_c[i];
	else if (m === RIGHT) ++cups_c[i];
	else if (m === UP   ) --cups_r[i];
	else if (m === DOWN ) ++cups_r[i];
	else throw new Error();
}

function move_box(m) {
	if      (m === LEFT ) --box_c;
	else if (m === RIGHT) ++box_c;
	else if (m === UP   ) --box_r;
	else if (m === DOWN ) ++box_r;
	else throw new Error();
}

function move(m) {
	for (let size = max_cup_size; size >= 0; --size) {
		for (let i = 0; i < number_of_cups; ++i) {
			if (cups_s[i] !== size) continue;
			if (cups_c[i] !== box_c || cups_r[i] !== box_r) continue;
			if (cups_d[i] === m) break;
			for (let j = 0; j < number_of_cups; ++j) {
				if (cups_c[i] === box_c && cups_r[i] === box_r && cups_s[i] <= size) {
					move_cup(i, m);
				}
			}
			move_box(m);
			return;
		}
	}
	move_box(m);
}

function visit(s) {
//	++visits;
	const p = paths.get(s);
	if (solution !== null && solution.length <= p.length + 1) {
		return;
	}
	const child_states_to_visit = [];
	[LEFT, RIGHT, UP, DOWN].forEach(m => {
		set_state(s);
		if (!can_move(m)) return;
		move(m);
		const child_state = get_state();
		if (paths.has(child_state) && paths.get(child_state).length <= p.length + 1) {
			return;
		}
		const child_path = p.concat(m);
//		console.log(child_path);
		paths.set(child_state, child_path);
		if (at_goal()) {
			solution = child_path;
		} else {
			child_states_to_visit.push(child_state);
		}
	});
	child_states_to_visit.forEach(s => visit(s));
}

function run() {
	paths.clear();
	solution = null;
	cups_c = start_cups_c.slice();
	cups_r = start_cups_r.slice();
	box_c  = start_c;
	box_r  = start_r;
	if (at_goal()) return;
	const initial_state = get_state();
	paths.set(initial_state, []);
	visit(initial_state);
	if (solution !== null && solution.length >= min_moves) {
		console.log(initial_state, goal_c, goal_r);
		console.log(solution);
	}
}

function permute_cup_start_positions() {
	const trials = 100;
	for (let t = 0; t < trials; ++t) {
		cup_start_c.length = 0;
		cup_start_r.length = 0;
		cups_s.forEach(s => {
			while (true) {
				const c = Math.floor(Math.random() * COLS);
				const r = Math.floor(Math.random() * ROWS);
				let good = true;
				for (let i = 0; i < cup_start_c.length; ++i) {
					if (cup_start_c[i] === c && cup_start_r[i] === r && cups_s[i] === s) {
						good = false;
						break;
					}
				}
				if (good) {
					cup_start_c.push(c);
					cup_start_r.push(r);
					break;
				}
			}
		});
		run();
	}
}

const cup_size_counts = [null, null, null]; // three sizes

function permute_cup_sizes() {
	for (let i = 0; i <= number_of_cups; ++i) {
		cup_size_counts[0] = i;
		for (let j = 0; j <= number_of_cups - i; ++j) {
			cup_size_counts[1] = j;
			cup_size_counts[2] = number_of_cups - i - j;
			cups_s.length = 0;
			for (let s = 0; s < 3; ++s) {
				for (let k = 0; k < cup_size_counts[s]; ++k) {
					cups_s.push(s);
				}
			}
			permute_cup_start_positions();
		}
	}
}

function permute_cup_dirs() {
	while (true) {
		permute_cup_sizes();
		for (let i = number_of_cups - 1; i >= 0; --i) {
			if (cups_d[i] === LEFT) {
				cups_d[i] = RIGHT;
				break;
			} else if (cups_d[i] === RIGHT) {
				cups_d[i] = UP;
				break;
			} else if (cups_d[i] === UP) {
				cups_d[i] = DOWN;
				break;
			} else {
				cups_d[i] = LEFT;
				if (i === 0) return;
			}
		}
	}
}

window.addEventListener('load', function() {
	for (number_of_cups = 0; number_of_cups < max_number_of_cups; ++number_of_cups) {
		cups_d.push(LEFT);
		if (number_of_cups >= min_number_of_cups) {
			permute_cup_dirs();
		}
	}	
});
