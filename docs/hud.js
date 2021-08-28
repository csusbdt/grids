g.hud = {};

g.hud.draw = function() {
	g.ctx.save();

	g.ctx.beginPath();

	const hc = g.cell_size * 0.5;
	g.ctx.translate(hc, hc);
	g.ctx.fillStyle = 'red';
	g.ctx.moveTo(0, 0);
	g.ctx.lineTo(hc, -0.3 * hc);
	g.ctx.lineTo(hc,  0.3 * hc);
	g.ctx.lineTo(0, 0);
	g.ctx.fill();

	const x = 2 * hc * (g.cols + 0);
	g.ctx.moveTo(x, 0);
	g.ctx.lineTo(x - hc, -0.3 * hc);
	g.ctx.lineTo(x - hc,  0.3 * hc);
	g.ctx.lineTo(x, 0);
	g.ctx.fill();

	g.ctx.arc(x / 2, 0, 0.3 * hc, 0, Math.PI * 2);
	g.ctx.fill();
	g.ctx.restore();
}

g.hud.touch = function(p) {
	if (p.y > g.cell_size * .8) {
		return false;
	}
	const hc = g.cell_size * 0.5;
	if (p.x < hc) {
		return false;
	}
	if (p.x < 2 * hc) {
		if (g.state.n === 0) {
			g.state.n = g.grids.length - 1;
		} else {
			--g.state.n;
		}
		g.start();
		return true;
	}
	if (p.x < hc * (g.cols + 1) - 0.3 * hc) {
		return false;
	}
	if (p.x < hc * (g.cols + 1) + 0.3 * hc) {
		g.start();
		return true;
	}
	if (p.x < 2 * hc * g.cols) {
		return false;
	}
	if (p.x < 2 * hc * (g.cols + 1) - hc) {
		if (g.state.n === g.grids.length - 1) {
			g.state.n = 0;
		} else {
			++g.state.n;
		}
		g.start();
		return true;
	}
	return false;
}