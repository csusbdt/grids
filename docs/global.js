window.LEFT  = 'l';
window.RIGHT = 'r';
window.UP    = 'u';
window.DOWN  = 'd';

g_canvas.width  = 500;
g_canvas.height = 500;
g_canvas.style.backgroundColor = 'lightblue';

window.g = {
	ctx: g_canvas.getContext('2d', { alpha: true }),
	cols: 3,
	rows: 3
};

const cell_size = Math.min(g_canvas.width / g.cols, g_canvas.height / g.rows);
g.ctx.scale(cell_size, cell_size);
