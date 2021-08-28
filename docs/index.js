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
	player_moves: []
};

for (let i = 0; i < g.grids.length; ++i) {
	initial_state.player_moves.push(null);
}

function save_state() {
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

//let canvas_left = 0;
//let canvas_top  = 0;

function adjust_canvas() {
	const w = window.innerWidth;
	const h = window.innerHeight;
//	g.hud_cell_size     = Math.min(w / 5, 200);
	g.cell_size         = Math.min(w / (g.cols + 1.0), h / (g.rows + 2.0), 200);
	g.canvas_left       = (w - g.cell_size * (g.cols + 1.0)) / 2;
	g.canvas_top        = (h - g.cell_size * (g.rows + 2.0)) / 2;
	g_canvas.style.left = g.canvas_left;
	g_canvas.style.top  = g.canvas_top;
	g_canvas.width      = g.cell_size * (g.cols + 1.0);
	g_canvas.height     = g.cell_size * (g.rows + 2.0);
	// g.ctx.translate(g.cell_size / 2, g.cell_size);
	// g.ctx.scale(g.cell_size, g.cell_size);
	g.grid.draw();
	g.hud.draw();
}

window.addEventListener('resize', adjust_canvas);

function hud_coords(e) {
	return {
		x: (e.pageX - g.canvas_left),
		y: (e.pageY - g.canvas_top )
	};
}

function grid_coords(e) {
	return {
		x: (e.pageX - g.canvas_left) / g.cell_size,
		y: (e.pageY - g.canvas_top ) / g.cell_size
	};
}

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
	p = grid_coords(e);
	const c = Math.floor(p.x - .5);
	const r = Math.floor(p.y - 1.0);
	if (c >= 0 && c < g.cols && r >= 0 && r < g.rows) {
		g.grid.click(c, r);
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
	g.minimum_moves = a[0];
	g.cols = a[1];
	g.rows = a[2];
	const exits = [ g.exit(a[3], a[4], a[5]) ]; // todo: multiple exits
	const box = g.box(a[6], a[7]);
	const cups = [];
	for (let i = 8; i < a.length; i += 4) {
		cups.push(g.cup(a[i + 0], a[i + 1], a[i + 2], a[i + 3]));
	}
	g.grid = new Grid(
		g.cols, 
		g.rows, 
		exits,
		box,
		cups 
	);
	adjust_canvas();
};

g.start();
