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

	click(c, r) {
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
