import { setupSlider } from "./slider.js";
import { setupTiles } from "./tiles.js";
import { setupTable } from "./table.js";
import { setupChart } from "./chart.js";

window.addEventListener("DOMContentLoaded", async () => {
  setupTiles();
  await setupTable();
  await setupChart();
  await setupSlider();
});
