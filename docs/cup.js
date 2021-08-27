class Cup {
	constructor(dir, size, c, r) {
		this.dir  = dir;
		this.size = size;
		this.c    = c;
		this.r    = r;
		this.delta_c = 0;
		this.delta_r = 0;
	}

	draw() {
		const ctx = g.ctx;
		const c   = this.c;
		const r   = this.r;
		const offset = [.1, .2, .3][this.size];
		ctx.save();
		ctx.translate(c + .5, r + .5);
		if (this.dir === RIGHT) {
			ctx.rotate(Math.PI);
		} else if (this.dir === UP) {
			ctx.rotate(Math.PI / 2);
		} else if (this.dir === DOWN) {
			ctx.rotate(3 * Math.PI / 2);
		}
		ctx.lineWidth   = .04;
		ctx.strokeStyle = 'blue';
		ctx.lineCap     = 'round';
		ctx.lineJoin    = 'round';
		ctx.beginPath();
		ctx.moveTo(-offset, -offset);
		ctx.lineTo( offset, -offset);
		ctx.lineTo( offset,  offset);
		ctx.lineTo(-offset,  offset);
		ctx.stroke();
		ctx.restore();
	}
}

g.cup = (dir, size, c, r) => {
	return new Cup(dir, size, c, r);
};
