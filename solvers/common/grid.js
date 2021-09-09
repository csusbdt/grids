class Grid {
	constructor(cols, rows, exits, box, cups) {
		this.cols  = cols;
		this.rows  = rows;
		this.exits = exits;
		this.box   = box;
		this.cups  = cups;
	}

	get_state() {
		let s = '' + this.box.c + this.box.r;
		for (let i = 0; i < this.cups.length; ++i) {
			const cup = this.cups[i];
			s = s + cup.c + cup.r;
		}
		return s;
	}

	set_state(s) {
		let j = 0;
		this.box.c = parseInt(s.charAt(j++));
		this.box.r = parseInt(s.charAt(j++));
		for (let i = 0; i < this.cups.length; ++i) {
			const cup = this.cups[i];
			cup.c = parseInt(s.charAt(j++));
			cup.r = parseInt(s.charAt(j++));
		}
	}
	
	at_goal() {
		if (this.box.c !== this.exit.c || this.box.r != this.exit.r) return false;
		for (let i = 0; i < this.cups.length; ++i) {
			const cup = this.cups[i];
			if (cup.c !== this.box.c || cup.r !== this.box.r) continue;
			if (cup.d !== this.exit.d) return false;
		}
		return true;
	}

	can_move(c, r) {
		let dir = null;
		if (this.box.c === c + 1 && this.box.r === r) {
			dir = LEFT;
			if (this.cups.some(cup => 
				cup.c === c && 
				cup.r === r &&
				cup.dir !== RIGHT
			)) return;
		} else if (this.box.c === c - 1 && this.box.r === r) {
			dir = RIGHT;
			if (this.cups.some(cup => 
				cup.c === c && 
				cup.r === r &&
				cup.dir !== LEFT
			)) return;
		} else if (this.box.c === c && this.box.r === r + 1) {
			dir = UP;
			if (this.cups.some(cup => 
				cup.c === c && 
				cup.r === r &&
				cup.dir !== DOWN
			)) return;
		} else if (this.box.c === c && this.box.r === r - 1) {
			dir = DOWN;
			if (this.cups.some(cup => 
				cup.c === c && 
				cup.r === r &&
				cup.dir !== UP
			)) return;
		} else {
			return;
		}
		for (let size = 0; size < 3; ++size) {
			for (let i = 0; i < this.cups.length; ++i) {
				const cup = this.cups[i];
				if (cup.size !== size) continue;
				if (cup.c !== this.box.c || cup.r !== this.box.r) continue;
				if (this.cups.some(cup => cup.c === c && cup.r === r && cup.size === size)) {
					return;
				}
			}
		}
	}

	click(c, r) {
		// check if move is valid

		// move
		const cohabiters = this.cups.filter(cup => cup.c === this.box.c && cup.r === this.box.r);
		cohabiters.forEach(cup => {
			if (cup.dir !== dir || cohabiters.some(other => other.size > cup.size && other.dir != dir)) {
				cup.c = c;
				cup.r = r;
			}
		});
		this.box.c = c;
		this.box.r = r;

		// check for exit
		for (let i = 0; i < this.exits.length; ++i) {
			const e = this.exits[i];
			if (e.c === c && e.r === r) {
				if (this.cups.every(cup => cup.c !== c || cup.r !== r || cup.dir === e.dir)) {
					if (e.dir === LEFT) {
						this.box.c -= .8;
					} else if (e.dir === RIGHT) {
						this.box.c += .8;
					} else if (e.dir === UP) {
						this.box.r -= .8;
					} else if (e.dir === DOWN) {
						this.box.r += .8;
					}
				}
			}
		}
		this.draw();
	}
}


//g.Grid = Grid;
window.Grid = Grid;
