// constants
window.LEFT      = 'l';
window.RIGHT     = 'r';
window.UP        = 'u';
window.DOWN      = 'd';
window.cup_dirs  = [LEFT, RIGHT, UP, DOWN];
window.max_cup_size = 2;
//window.cup_sizes = [0, 1, 2];

// run constants
window.max_moves = 50;
window.min_moves = 1;
window.cols      = 2;
window.rows      = 5;
window.exit_d    = 'l';
window.exit_c    = 0;
window.exit_r    = 4; 
window.start_c   = 0;
window.start_r   = 0;
window.number_of_cups = 0;
window.cups_d    = [];
window.cups_s    = [];

window.cells = [];
for (let c = 0; c < cols; ++c) {
	for (let r = 0; r < rows; ++r) {
		cells.push([c, r]);
	}
}

// run variables
window.paths     = new Map();
window.solution  = null;
window.cups_c    = [];
window.cups_r    = [];
window.box_c     = start_c;
window.box_r     = start_r;

window.get_state = function() {
	let s = '' + box_c + box_r;
	for (let i = 0; i < cups.length; ++i) {
		s = s + cups_c[i] + cups_r[i];
	}
	return s;
}

window.set_state = function(s) {
	let j = 0;
	box_c = parseInt(s.charAt(j++));
	box_r = parseInt(s.charAt(j++));
	for (let i = 0; i < cups_s.length; ++i) {
		cups_c[i] = parseInt(s.charAt(j++));
		cups_r[i] = parseInt(s.charAt(j++));
	}
}

window.at_goal = function() {
	if (box_c !== exit_c || box_r !== exit_r) return false;
	for (let i = 0; i < cups.length; ++i) {
		if (cups_c[i] !== box_c || cups_r[i] !== box_r) continue;
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
	for (let i = 0; i < cups_c.length; ++i) {
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
