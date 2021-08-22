const offsets = [.1, .2, .3];

class Cup {
	constructor(size, dir, c, r) {
		this.size = size;
		this.dir  = dir;
		this.c    = c;
		this.r    = r;
	}

	draw() {
		const ctx = g.ctx;
		const c   = this.c;
		const r   = this.r;
		const offset = offsets[this.size];
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

g.cup = (size, dir, c, r) => {
	return new Cup(size, dir, c, r);
};
