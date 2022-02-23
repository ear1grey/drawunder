
const canvasEl = document.querySelector('#hili');

function drawRect(c, x, y, w, h, radius = 6, padding = 6) {
  x = x - padding;
  y = y - padding;
  const x2 = x + w + padding * 2;
  const y2 = y + h + padding * 2;
  c.beginPath();
  c.moveTo(x + radius, y);
  c.lineTo(x2 - radius, y);
  c.quadraticCurveTo(x2, y, x2, y + radius);
  c.lineTo(x2, y + h - radius);
  c.quadraticCurveTo(x2, y2, x2 - radius, y2);
  c.lineTo(x + radius, y2);
  c.quadraticCurveTo(x, y2, x, y2 - radius);
  c.lineTo(x, y + radius);
  c.quadraticCurveTo(x, y, x + radius, y);
  c.stroke();
  c.fill();
}

// draw a line on canvas context `c`, from point x1,y1 to point x2,y2
function drawLine(c, x1, y1, x2, y2) {
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}


function draw() {
  // set the canvas size to the window size (this also clears it)
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;

  // get the context
  const c = canvasEl.getContext('2d');

  // set the drawing style
  c.lineWidth = 4;
  c.strokeStyle = '#ff000088';
  c.fillStyle = '#ff0';
  c.lineCap = 'round';

  const queue = { lines: [], rects: [] };

  let lastCX, lastCY;

  const words = document.querySelectorAll('span.c');
  for (const el of words) {
    // find dimentions of the element
    const elTop = offY(el) - window.scrollY;
    const elLeft = offX(el) - window.scrollX;
    const elW = el.offsetWidth;
    const elH = el.offsetHeight;
    const elCX = elLeft + elW / 2;
    const elCY = elTop + elH / 2;

    if (lastCX != null) {
      // when there's a previous node, there shoudl be a
      // line from it to the current one.
      queue.lines.push([c, lastCX, lastCY, elCX, elCY]);
    }
    lastCX = elCX;
    lastCY = elCY;

    // draw the
    queue.rects.push([c, elLeft, elTop, elW, elH]);
  }

  // draw lines first
  for (const l of queue.lines) {
    drawLine(...l);
  }

  // draw rectangles over the lines
  for (const rect of queue.rects) {
    drawRect(...rect);
  }
}


// positions of a given element in a given root element
function offX(el, root) {
  if (el === null || el === root) return 0;
  return el.offsetLeft + offX(el.offsetParent, root);
}
function offY(el, root) {
  if (el === null || el === root) return 0;
  return el.offsetTop + offY(el.offsetParent, root);
}


/**
 * Pressing P will toggle perspective on and off
 */
document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyP') {
    document.body.classList.toggle('perspective');
  }
});

/**
 * A function to add a span around text
 */
function addSpan(txt) {
  return `<span>${txt}</span>`;
}

/**
 * A utility function that takes a stting and wraps
 * every word in a span.
 */
function markup(txt) {
  return txt.split(' ').map(addSpan).join(' ');
}

/**
 * A preparation function that finds all textContent
 * within and article and adds a span to every word
 * then adds an event listent to every span, so that
 * when spans are clicked, words and highlighted and
 * joined.
 */
function prep() {
  const art = document.querySelector('article');
  for (const node of art.childNodes) {
    node.innerHTML = markup(node.textContent);
  }

  art.addEventListener('click', (e) => {
    e.target.classList.toggle('c');
    draw();
  });

  draw();
}
window.addEventListener('load', prep); // initial draw
window.addEventListener('scroll', draw); // if we move the page we need to redraw because the canvas doesn't move
window.addEventListener('resize', draw); // if we resize the page, it may reflow so we must redraw
