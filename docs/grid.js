class Grid {
	constructor(cols, rows, exits, cups, box) {
		this.cols  = cols;
		this.rows  = rows;
		this.exits = exits;
		this.cups  = cups;
		this.box   = box;
	}

	draw() {
		const ctx = g.ctx;
		ctx.save();
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
		ctx.restore();
		this.exits.forEach(o => o.draw());
		this.cups.forEach(o => o.draw());
		this.box.draw();
	}

	cups_at(c, r) {
		const cups = [null, null, null];
		this.cups.forEach(cup => {
			if (cup.c === c && cup.r === r) {
				cups[cup.size] = cup;
			}
		});
		return cups;
	}

	click(c, r) {
		let dir = null;
		if (this.box.c === c + 1 && this.box.r === r) {
			dir = LEFT;
		} else if (this.box.c === c - 1 && this.box.r === r) {
			dir = RIGHT;
		} else if (this.box.c === c && this.box.r === r + 1) {
			dir = UP;
		} else if (this.box.c === c && this.box.r === r - 1) {
			dir = DOWN;
		} else {
			return;
		}
		const arriving_cups = [];

		let cups = this.cups_at(c, r);
		if (cups[2]) {
			if (cups[2].dir !== dir) {
				arriving
			}
		}


		for (let i = 0; i < this.cups.length; ++i) {
			const cup = this.cups[i];
			if (cup.c === this.box.c && cup.r === this.box.r) {
				
			}
		}

		this.cups_at(c, r).filter(cup => {
			if (cup === null) return false;
			if (dir === LEFT) {
			}
		});
		for (let i = 0; i < this.cups.length; ++i) {
			const cup = this.cups[i];
			if (cup.c === this.box.c && cup.r === this.box.r) {
				
			}
		}


		const receiving_cups = this.cups.map(cup => cup.c === c && cup.r === r);

		if (this.box.c === c + 1 && this.box.r === r) {

			console.log('go left');
		} else if (this.box.c === c - 1 && this.box.r === r) {
			console.log('go right');
		} else if (this.box.c === c && this.box.r === r + 1) {
			console.log('go up');
		} else if (this.box.c === c && this.box.r === r - 1) {
			console.log('go down');
		}
	}
}

g.grid = (cols, rows, exits, cups, box) => {
	return new Grid(cols, rows, exits, cups, box);
};
