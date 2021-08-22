class Exit {
	constructor(dir, c, r) {
		this.dir  = dir;
		this.c    = c;
		this.r    = r;
	}

	draw() {
		const ctx = g.ctx;
		const c   = this.c;
		const r   = this.r;
		ctx.save();
		ctx.translate(c + .5, r + .5);
		if (this.dir === RIGHT) {
			ctx.rotate(Math.PI);
		} else if (this.dir === UP) {
			ctx.rotate(Math.PI / 2);
		} else if (this.dir === DOWN) {
			ctx.rotate(3 * Math.PI / 2);
		}
		ctx.fillStyle = 'orange';
		ctx.beginPath();
		ctx.arc(0, 0, 0.02, 0, 2 * Math.PI);
		ctx.fill();
		ctx.lineWidth   = .01;
		ctx.lineCap     = 'round';
		ctx.strokeStyle = 'orange';
		ctx.moveTo(0, 0);
		ctx.lineTo(-0.55, 0);
		ctx.stroke();
		ctx.restore();
	}
}

g.exit = (dir, c, r) => {
	return new Exit(dir, c, r);
};
