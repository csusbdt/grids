g.hud = {};

g.hud.draw = function() {
	g.ctx.save();

	g.ctx.translate(g.cell_size / 2, g.cell_size / 2 + 8);
	g.ctx.scale(g.cell_size / 78, g.cell_size / 78);
//	g.ctx.fillStyle = g_canvas.style.backgroundColor;
//	g.ctx.fillRect(0, 0, this.cols, this.rows);

	g.ctx.font = '20px Arial, sans-serif';
	g.ctx.fillText('' + g.state.n, 0, 0);


	g.ctx.font = '28px Arial, sans-serif';
	g.ctx.fillText('<', 60, 2);
	g.ctx.fillText('>', 110, 2);
	g.ctx.fillText('?', 160, 2);
	g.ctx.fillText('!', 220, 2);
	g.ctx.restore();
}

g.hud.touch = function(p) {
	//console.log(p);
	if (p.y > 60) return false;
	if (p.x < 90) return false;
	if (p.x < 132) {
		if (g.state.n === 0) {
			g.state.n = g.grids.length - 1;
		} else {
			--g.state.n;
		}
		g.start();
		return true;
	}
	if (p.x < 178) {
		if (g.state.n === g.grids.length - 1) {
			g.state.n = 0;
		} else {
			++g.state.n;
		}
		g.start();
		return true;
	}
	if (p.x < 230) {
		console.log("help");
		return true;
	}
	if (p.x < 280) {
//		console.log("reset");
		g.start();
		return true;
	}
	return false;
}