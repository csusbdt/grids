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
	g.box(1, 1)
);

addEventListener('load', () => {
	//grid.draw();
});

let cell_size   = 200;
let canvas_left = 0;
let canvas_top  = 0;

function adjust_canvas() {
	const w = window.innerWidth;
	const h = window.innerHeight;
	// allow half a cell for grid margin inside canvas
	cell_size           = Math.min(w / (g.cols + 1), h / (g.rows + 1), 200);
	canvas_left         = (w - cell_size * (g.cols + 1)) / 2;
	canvas_top          = (h - cell_size * (g.rows + 1)) / 2;
	g_canvas.style.left = canvas_left;
	g_canvas.style.top  = canvas_top;
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
		x: (e.pageX - canvas_left) / cell_size,
		y: (e.pageY - canvas_top ) / cell_size
	};
};

const on_touch = p => {
	const c = Math.floor(p.x - .5);
	const r = Math.floor(p.y - .5);
	if (c >= 0 && c < g.cols && r >= 0 && r < g.rows) {
		grid.click(c, r);
	}
};

const mousemove = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
};

const mousedown = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'default';
	on_touch(canvas_coords(e));
};

// the following touchend and touchmove code needed for fullscreen on chrome
// see: https://stackoverflow.com/questions/42945378/full-screen-event-on-touch-not-working-on-chrome/42948120

const touchend = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'none';
	on_touch(canvas_coords(e.changedTouches[0]));
};

const touchmove = e => {
	e.preventDefault();
}

g_canvas.addEventListener('mousemove', mousemove, true);
g_canvas.addEventListener('mousedown', mousedown, true); 
g_canvas.addEventListener('touchend' , touchend , true); 
g_canvas.addEventListener('touchmove', touchmove, { passive: false }); 
