const tilesElements = document.querySelectorAll(".js-feature-tile");
const sumElementWrapper = document.querySelector(".js-feature-sum");
const sumElement = document.querySelector(".js-feature-sum [data-key='value']");

const tiles = [];

const handleClick = (e, tile) => {
  const { dataset } = tile;
  const active = dataset.active !== "true";
  dataset.active = active;

  if (active) {
    tile.classList.remove("border-gray-300", "border");
    tile.classList.add("border-primary", "border-2");
  } else {
    tile.classList.remove("border-primary", "border-2");
    tile.classList.add("border-gray-300", "border");
  }

  tiles[dataset.index].active = active;
  const sum = tiles.reduce((acc, curr) => {
    if (curr.active) {
      return acc + curr.price;
    }
    return acc;
  }, 0);

  sumElementWrapper.classList.toggle("invisible", sum === 0);
  sumElement.textContent = sum;
};

export const setupTiles = () => {
  tilesElements.forEach((tile, index) => {
    tile.dataset.active = false;
    tile.dataset.index = index;
    tile.addEventListener("click", (e) => handleClick(e, tile));
    tiles.push({
      index,
      price: Number.parseInt(tile.dataset.price),
      active: false,
    });
  });
};
