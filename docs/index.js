import './global.js';
import './exit.js';
import './box.js';
import './cup.js';
import './grid.js';


addEventListener('load', () => {
	console.log('hi');
});

setTimeout(() => {
}, 1000);


g.exit(DOWN, 0, 0).draw();

for (let c = 0; c < g.cols; ++c) {
	for (let r = 0; r < g.rows; ++r) {
		for (let size = 0; size < 3; ++size) {
			g.cup(size, DOWN, c, r).draw();
//			g.box(c, r).draw();
		}		
	}	
}

g.grid().draw();
