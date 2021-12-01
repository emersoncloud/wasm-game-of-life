import { Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";


const universe = Universe.new_size(4, 4);
const width = universe.width();
const height = universe.height();
universe.print_cells();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const getIndex = (row, column) => {
  return row * width + column;
}


const renderLoop = () => {
  drawGrid();
  drawCells();

  universe.tick();
  setTimeout(() => {renderLoop()}, 1000);

};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  //Horizontal Lines
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1)
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE +1) +1);
  }
  ctx.stroke();
}

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  console.log(n, byte);
  const mask = 1 << (n % 8);
  return (arr[byte] & mask) === mask;
}

const drawCells = () => {
  console.log("drawing cells");
  const cellsPtr = universe.cells();
  console.log(cellsPtr);
  console.log(width, height)
  const cells = new Uint8Array(memory.buffer, cellsPtr, 4);
  // const cells = new Uint8Array([10, 20]);
  const eArr = cells.entries();

  console.log(eArr.next().value)
  console.log(eArr.next().value)
  console.log(eArr.next().value)
  console.log(eArr.next().value)
  console.log(eArr.next().value)
  console.log(eArr.next().value)

  // console.log(cells);
  for(let i = 0; i < width * height; i++) {
    console.log(bitIsSet(i, cells));
  }

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = bitIsSet(idx, cells)
        ? ALIVE_COLOR
        : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);