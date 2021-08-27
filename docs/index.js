import './global.js';
import './hud.js';
import './grids.js';
import './grid.js';
import './exit.js';
import './box.js';
import './cup.js';

document.body.style.backgroundColor = 'lightblue';
document.body.style.margin = '0';
document.body.style.padding = '0';
g_canvas.style.margin = '0';
g_canvas.style.padding = '0';
g_canvas.style.backgroundColor = document.body.style.backgroundColor;
g_canvas.style.backgroundColor = 'white';
g_canvas.style.position = 'absolute';

const initial_state = {
	version: '0',
	n: 0,
	moves: []
};

for (let i = 0; i < g.grids.length; ++i) {
	initial_state.moves.push(null);
}

g.save_state = () => {
	localStorage.setItem('grids', JSON.stringify(g.state));
};

let state_string = localStorage.getItem('grids');
if (state_string === null) {
	g.state = initial_state;
} else {
	g.state = JSON.parse(state_string);
	if (!('version' in g.state)) {
		g.state = initial_state;
	} else {
		if (g.state.version !== initial_state.version) {
			g.state = initial_state;
		}	
	}
}

let cell_size   = 200;
let canvas_left = 0;
let canvas_top  = 0;

function adjust_canvas() {
	const w = window.innerWidth;
	const h = window.innerHeight;
	// allow half a cell for grid margin inside canvas
	// full cell for top margin for icons
	g.cell_size         = Math.min(w / (g.cols + 1), h / (g.rows + 1.5), 200);
	canvas_left         = (w - g.cell_size * (g.cols + 1)) / 2;
	canvas_top          = (h - g.cell_size * (g.rows + 1.5)) / 2;
	g_canvas.style.left = canvas_left;
	g_canvas.style.top  = canvas_top;
	g_canvas.width      = g.cell_size * (g.cols + 1);
	g_canvas.height     = g.cell_size * (g.rows + 1.5);
	// g.ctx.translate(g.cell_size / 2, g.cell_size);
	// g.ctx.scale(g.cell_size, g.cell_size);
	grid.draw();
	g.hud.draw();
}

window.addEventListener('resize', adjust_canvas);

const hud_coords = e => {
	return {
		x: (e.pageX - canvas_left) / (g.cell_size / 78),
		y: (e.pageY - canvas_top ) / (g.cell_size / 78)
	};
};

// Convert mouse event coords to game world coords.
const canvas_coords = e => {
	return {
		x: (e.pageX - canvas_left) / g.cell_size,
		y: (e.pageY - canvas_top ) / g.cell_size
	};
};

// const on_touch = p => {
// 	const c = Math.floor(p.x - .5);
// 	const r = Math.floor(p.y - .5);
// 	if (c >= 0 && c < g.cols && r >= 0 && r < g.rows) {
// 		grid.click(c, r);
// 	}
// };

const on_touch = e => {
	let p = hud_coords(e);
	if (g.hud.touch(p)) return;
	p = canvas_coords(e);
	const c = Math.floor(p.x - .5);
	const r = Math.floor(p.y - 1.0);
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
	on_touch(e);
//	on_touch(canvas_coords(e));
};

// the following touchend and touchmove code needed for fullscreen on chrome
// see: https://stackoverflow.com/questions/42945378/full-screen-event-on-touch-not-working-on-chrome/42948120

const touchend = e => {
	e.preventDefault();
	e.stopImmediatePropagation();
	g_canvas.style.cursor = 'none';
	on_touch(e.changedTouches[0]);
//	on_touch(canvas_coords(e.changedTouches[0]));
};

const touchmove = e => {
	e.preventDefault();
}

g_canvas.addEventListener('mousemove', mousemove, true);
g_canvas.addEventListener('mousedown', mousedown, true); 
g_canvas.addEventListener('touchend' , touchend , true); 
g_canvas.addEventListener('touchmove', touchmove, { passive: false }); 

let grid = null;

g.start = () => {
	const a = g.grids[g.state.n];
	g.cols = a[0];
	g.rows = a[1];
	const exits = [ g.exit(a[2], a[3], a[4]) ]; // todo: multiple exits
	const box = g.box(a[5], a[6]);
	const cups = [];
	for (let i = 7; i < a.length; i += 4) {
		cups.push(g.cup(a[i + 0], a[i + 1], a[i + 2], a[i + 3]));
	}
	grid = g.grid(
		g.cols, 
		g.rows, 
		exits,
		box,
		cups 
	);
	adjust_canvas();
};

g.start();
