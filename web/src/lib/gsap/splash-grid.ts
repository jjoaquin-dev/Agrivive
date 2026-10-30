export interface SplashTile {
  r: number;
  c: number;
  el: HTMLDivElement;
  leftEdgeOrder: number;
}

export function createSplashGrid(gridEl: HTMLElement, cols = 18, rows = 10) {
  gridEl.innerHTML = "";
  const rawTiles: SplashTile[] = [];
  const midRow = (rows - 1) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      gridEl.appendChild(tile);
      const chevronOffset = (Math.abs(r - midRow) / midRow) * 4.0;
      rawTiles.push({ r, c, el: tile, leftEdgeOrder: c - chevronOffset });
    }
  }

  const tilesLeftEdge = [...rawTiles]
    .sort((a, b) => a.leftEdgeOrder - b.leftEdgeOrder)
    .map((t) => t.el);

  return { cols, rows, rawTiles, tilesLeftEdge };
}
