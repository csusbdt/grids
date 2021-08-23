window.LEFT  = 'l';
window.RIGHT = 'r';
window.UP    = 'u';
window.DOWN  = 'd';

document.body.style.backgroundColor = 'lightblue';
g_canvas.style.backgroundColor = document.body.style.backgroundColor;
g_canvas.style.position = 'absolute';

window.g = {
	ctx: g_canvas.getContext('2d', { alpha: true })
};
