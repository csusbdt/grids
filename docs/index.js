import './global.js';
import './exit.js';
import './box.js';
import './cup.js';
import './grid.js';

const grid = g.grid(
	g.cols, 
	g.rows, 
	[ g.exit(LEFT, 0, 0) ], 
	[ g.cup(0, DOWN, 1, 1), g.cup(1, UP, 0, 1) ], 
	g.box(1, 0)
);

addEventListener('load', () => {
	//grid.draw();
});

let cell_size = 200;

function adjust_canvas() {
	const w = window.innerWidth;
	const h = window.innerHeight;

	// allow half a cell for grid margin inside canvas
	cell_size     = Math.min(w / (g.cols + 1), h / (g.rows + 1), 200);
	g_canvas.style.left = (w - cell_size * (g.cols + 1)) / 2;
	g_canvas.style.top  = (h - cell_size * (g.rows + 1)) / 2;
	g_canvas.width      = cell_size * (g.cols + 1);
	g_canvas.height     = cell_size * (g.rows + 1);

	g.ctx.translate(cell_size / 2, cell_size / 2);
	g.ctx.scale(cell_size, cell_size);
	grid.draw();
}

adjust_canvas();

window.addEventListener('resize', adjust_canvas);

// Convert mouse event coords to game world coords.
const canvas_coords = e => {
	return {
		x: (e.pageX - g_canvas.style.left) / cell_size,
		y: (e.pageY - g_canvas.style.top ) / cell_size
	};
};
