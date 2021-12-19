// config
const trials    = 1000;
const max_moves = 64;
const min_moves = 32;
const cols      = 5;
const rows      = 5;
const exit_d    = 'l';
const exit_c    = 0;
const exit_r    = 4;
const start_c   = 0;
const start_r   = 0;
const min_number_of_cups = 10;
const max_number_of_cups = 14;
const max_cup_size       = 2;

// constants
const LEFT      = 'l';
const RIGHT     = 'r';
const UP        = 'u';
const DOWN      = 'd';

// run constants
let number_of_cups = 0;
const cups_d         = [];  // parallel arrays
const cups_s         = [];
const cups_start_c   = [];
const cups_start_r   = [];

// run variables
const paths   = new Map();
let solution  = null;
let box_c     = start_c;
let box_r     = start_r;
let cups_c    = [];
let cups_r    = [];

if (cols > 9 || rows > 9) {
	throw new Error('need to fix code for cols or rows > 9');
}

const get_state = function() {
	let s = '' + box_c + box_r;
	for (let i = 0; i < number_of_cups; ++i) {
		s = s + cups_c[i] + cups_r[i];
	}
	return s;
}

const set_state = function(s) {
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

const at_goal = function() {
	if (box_c !== exit_c || box_r !== exit_r) return false;
	for (let i = 0; i < number_of_cups; ++i) {
		if (cups_c[i] !== exit_c || cups_r[i] !== exit_r) continue;
		if (cups_d[i] !== exit_d) return false;
	}
	return true;
}

const opposite = function(dir) {
	if (dir === LEFT ) return RIGHT;
	if (dir === RIGHT) return LEFT;
	if (dir === UP   ) return DOWN;
	if (dir === DOWN ) return UP;
	throw new Error();
}

const can_move = function(dir) {
	let dst_c = box_c;
	let dst_r = box_r;
	if (dir === LEFT ) --dst_c;
	if (dir === RIGHT) ++dst_c;
	if (dir === UP   ) --dst_r;
	if (dir === DOWN ) ++dst_r;

	if (dst_c < 0 || dst_c === cols || dst_r < 0 || dst_r === rows) return false;

	for (let i = 0; i < number_of_cups; ++i) {
		if (cups_c[i] === dst_c && cups_r[i] === dst_r && cups_d[i] !== opposite(dir)) {
			return false;
		}
	}

	for (let size = 0; size <= max_cup_size; ++size) {
		for (let i = 0; i < number_of_cups; ++i) {
			if (cups_s[i] !== size) continue;
			if (cups_c[i] !== box_c || cups_r[i] !== box_r) continue;
			if (cups_d[i] === dir) continue;
			for (let i = 0; i < number_of_cups; ++i) {
				if (cups_c[i] !== dst_c || cups_r[i] !== dst_r) continue;
				if (cups_s[i] <= size) return false;
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

let visits = 0;

function visit(s) {
    ++visits;
    if (visits > 1000000) return;
    // if (visits % 100000 === 0) {
    //     console.log('visit ' + visits);
    // }
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
    visits = 0;
	paths.clear();
	solution = null;
	cups_c = cups_start_c.slice();
	cups_r = cups_start_r.slice();
	box_c  = start_c;
	box_r  = start_r;
	if (at_goal()) return;
	const initial_state = get_state();
	paths.set(initial_state, []);
	visit(initial_state);
	if (solution !== null && solution.length >= min_moves) {
		const a = [
			solution.length, cols, rows, exit_d, exit_c, exit_r, start_c, start_r
		];
		for (let i = 0; i < number_of_cups; ++i) {
			a.push(cups_d[i], cups_s[i], cups_start_c[i], cups_start_r[i]);
		}
		console.log(JSON.stringify(a) + ",");
//		console.log(initial_state, exit_c, exit_r);
//		console.log(solution);
	}
}

function rand_int(n) {
	return Math.floor(Math.random() * n);
}

function rand_dir() {
	const n = rand_int(4);
	if (n === 0) return LEFT;	
	if (n === 1) return RIGHT;	
	if (n === 2) return UP;	
	if (n === 3) return DOWN;	
}

function rand_size() {
	return rand_int(max_cup_size + 1);
}

function rand_c() {
	return rand_int(cols);
}

function rand_r() {
	return rand_int(rows);
}

for (let t = 0; t < trials; ++t) {
    console.log("trial " + t);
    cups_d.length = 0;
    cups_s.length = 0;
    cups_start_c.length = 0;
    cups_start_r.length = 0;
    
    // cups_d       = [];
    // cups_s       = [];
    // cups_start_c = [];
    // cups_start_r = [];
    
    number_of_cups = min_number_of_cups + rand_int(max_number_of_cups - min_number_of_cups + 1);
    for (let i = 0; i < number_of_cups; ++i) {
        cups_d[i] = rand_dir();
        cups_s[i] = rand_size();
        while (true) {
            const c = rand_c();
            const r = rand_r();
            let good = true;
            for (let j = 0; j < i; ++j) {
                if (cups_start_c[j] === c && cups_start_r[j] === r && cups_s[j] === cups_s[i]) {
                    good = false;
                }
            }
            if (good) {
                cups_start_c.push(c);
                cups_start_r.push(r);
                break;
            }
        }
    }
    run();
}
