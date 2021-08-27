class Box {
	constructor(c, r) {
		this.c       = c;
		this.r       = r;
		this.delta_c = 0;
		this.delta_r = 0;
	}

	draw() {
		const ctx = g.ctx;
		const c   = this.c;
		const r   = this.r;
		ctx.save();
		ctx.fillStyle = 'green';
		ctx.translate(c + .5, r + .5);
		ctx.fillRect(-0.05, -0.05, 0.1, 0.1);
		ctx.restore();
	}
}

g.box = (c, r) => {
	return new Box(c, r);
};
