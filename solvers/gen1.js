import './common/global.js';
import './common/grid.js';
import './common/exit.js';
import './common/box.js';
import './common/cup.js';

max_moves = 50;
min_moves = 1;
cols      = 2;
rows      = 5;
exit_d    = LEFT;
exit_c    = 0;
exit_r    = 4; 
start_c   = 0;
start_r   = 0;
max_number_of_cups = 6;

// todo: permute exit and box start

cups_d = [LEFT];
cups_s = [0];
for (number_of_cups = 2; number_of_cups < max_number_of_cups; ++number_of_cups) {
	cups_d.push(LEFT);
	cups_s.push(0);
	permute_cup_sizes();
}

function permute_cup_sizes() {
	while (true) {
		permute_cup_dirs();
		for (let i = cups_s.length - 1; i > 0; --i) {
			if (++cups_s[i] < 3) {
				break;
			} else {
				cups_s[i] = 0;
				if (i === 0) return;
			}
		}
	}
}

function permute_cup_dirs() {
	while (true) {
		permute_cup_start_c();
		for (let i = cups_d.length - 1; i > 0; --i) {
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

function permute_cup_start_c() {
	while (true) {
		permute_cup_start_r();
		for (let i = cups_c.length - 1; i > 0; --i) {
			if (++cups_c[i] < cols) {
				break;
			} else {
				cups_c[i] = 0;
				if (i === 0) return;
			}
		}
	}
}

function permute_cup_start_r() {
	while (true) {
		run();
		for (let i = cups_r.length - 1; i > 0; --i) {
			if (++cups_r[i] < rows) {
				break;
			} else {
				cups_r[i] = 0;
				if (i === 0) return;
			}
		}
	}
}

function run() {
	paths.clear();
	solution = null;
	cups_c = [];
	cups_r = [];
	for (let i = 0; i < cups_s.length; ++i) {
		const size = cups_s[i];
		for (let c = 0; c < cols && cups_c.length === i; ++c) {
			for (let r = 0; r < rows && cups_c.length === i; ++r) {
				let good_spot = true;
				for (let j = 0; j < i; ++j) {
					if (cups_c[j] === c && cups_r[j] === r && cups_s[j] === size) {
						good_spot = false;
						break;
					}
				}
				if (good_spot) {
					cups_c.push(c);
					cups_r.push(r);
				}
			}
		}
	}
	if (cups_c.length < cups_s.length) {
		// no feasible start position for at least one cup
		return;
	}
	box_c = start_c;
	box_r = start_r;
	if (at_goal()) return;
	const initial_state = get_state();
	paths.set(initial_state, []);
	visit(initial_state);
	if (solution !== null && solution.length >= min_moves) {
		console.log(initial_state, goal_c, goal_r);
		console.log(solution);
	}
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
