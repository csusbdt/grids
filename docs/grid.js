class Grid {
	constructor() {
	}

	draw() {
		const ctx = g.ctx;
		ctx.save();
		ctx.lineWidth   = .01;
		ctx.strokeStyle = 'black';
		ctx.lineCap     = 'round';
		ctx.lineJoin    = 'round';		
		ctx.beginPath();
		for (let c = 0; c < g.cols; ++c) {
			for (let r = 0; r < g.rows; ++r) {
				ctx.strokeRect(c, r, c + 1, r + 1);
			}
		}
		ctx.restore();
	}
}

g.grid = () => {
	return new Grid();
}
