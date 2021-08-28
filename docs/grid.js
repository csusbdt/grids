class Grid {
	constructor(cols, rows, exits, box, cups) {
		this.cols  = cols;
		this.rows  = rows;
		this.exits = exits;
		this.box   = box;
		this.cups  = cups;
	}

	draw() {
		const ctx = g.ctx;
		ctx.save();
		g.ctx.translate(g.cell_size / 2, g.cell_size);
		g.ctx.scale(g.cell_size, g.cell_size);
		ctx.fillStyle = g_canvas.style.backgroundColor;
		ctx.fillRect(0, 0, this.cols, this.rows);
		ctx.lineWidth   = .01;
		ctx.strokeStyle = 'black';
		ctx.lineCap     = 'round';
		ctx.lineJoin    = 'round';		
		ctx.beginPath();
		for (let c = 0; c < this.cols; ++c) {
			for (let r = 0; r < this.rows; ++r) {
				ctx.strokeRect(c, r, 1, 1);
			}
		}
		this.exits.forEach(o => o.draw());
		this.cups.forEach(o => o.draw());
		this.box.draw();
		ctx.restore();
	}

	// cups_at(c, r) {
	// 	const cups = [null, null, null];
	// 	this.cups.forEach(cup => {
	// 		if (cup.c === c && cup.r === r) {
	// 			cups[cup.size] = cup;
	// 		}
	// 	});
	// 	return cups;
	// }

	click(c, r) {
		// check if move is valid
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

// g.grid = (cols, rows, exits, box, cups) => {
// 	return new Grid(cols, rows, exits, box, cups);
// };

//g.Grid = Grid;
window.Grid = Grid;
