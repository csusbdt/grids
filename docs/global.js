window.LEFT  = 'l';
window.RIGHT = 'r';
window.UP    = 'u';
window.DOWN  = 'd';

document.body.style.backgroundColor = 'lightblue';
g_canvas.style.backgroundColor = 'lightblue';
g_canvas.style.position = 'absolute';

window.g = {
	ctx: g_canvas.getContext('2d', { alpha: true }),
	cols: 2,
	rows: 5
};
