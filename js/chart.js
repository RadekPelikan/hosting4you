const wrapper = document.querySelector(".js-stat-chart-wrapper");
const data = {};

const loadData = async () => {
  const response = await fetch("/assets/json/chart.json");
  let json = await response.json();
  let max = 0;
  json.forEach((item) => {
    max += item.value;
  });
  let sorted = json
    .sort((first, second) => first.value - second.value)
    .reverse();
  sorted.forEach((item, index) => {
    item.percentage = item.value / max;
    item.color = [
      Math.floor(Math.random() * (255 - 220) + 200),
      100,
      (index / json.length) * (95 - 60) + 60,
    ];
  });
  data.items = sorted;
  data.max = max;

  return 1;
};
const generateChart = () => {
  let sketch = function (p) {
    p.setup = function () {
      p.createCanvas(wrapper.clientWidth, wrapper.clientHeight);
      // set mode HSL
      p.colorMode(p.HSL, 360, 100, 100, 100);
    };

    p.draw = function () {
      // clear canvas
      p.background(0, 0, 100);
      p.translate(p.width / 2, p.height / 2);

      p.noStroke();
      p.fill(0, 255, 0);

      let hovering = false;
      let hoveringOver = 0;

      let start = 0;
      data.items.forEach((item, index) => {
        p.fill(...item.color);
        let mouseAngle = p.atan2(
          p.mouseY - p.height / 2,
          p.mouseX - p.width / 2
        );

        // if mouseAngle is negative, add 2PI to it
        if (mouseAngle < 0) {
          mouseAngle += p.TWO_PI;
        }

        // If mouse is in the arc, set color to red
        if (
          mouseAngle > start &&
          mouseAngle < start + p.TWO_PI * item.percentage &&
          p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2) < 350 / 2 &&
          p.dist(p.mouseX, p.mouseY, p.width / 2, p.height / 2) > 200 / 2
        ) {
          hovering = true;
          p.arc(0, 0, 350, 350, start, start + p.TWO_PI * item.percentage);

          hoveringOver = index;
        } else {
          p.arc(0, 0, 300, 300, start, start + p.TWO_PI * item.percentage);
        }
        start += p.TWO_PI * item.percentage;
      });

      // Draw inner circle
      p.fill(0, 0, 100);
      p.ellipse(0, 0, 200, 200);
      if (hovering) {
        let width = 100;
        let height = 50;
        p.fill(0, 0, 0);
        p.rect(
          p.mouseX - p.width / 2 - width / 2,
          p.mouseY - p.height / 2 - height / 2,
          width,
          height,
          10
        );
        // Into rectange type value and percentage
        p.fill(0, 0, 100);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(
          data.items[hoveringOver].value,
          p.mouseX - p.width / 2,
          p.mouseY - p.height / 2 - 10
        );
        p.fill(0, 0, 80);
        p.textSize(15);
        p.text(
          `${Math.round(data.items[hoveringOver].percentage * 10_000) / 100}%`,
          p.mouseX - p.width / 2,
          p.mouseY - p.height / 2 + 10
        );
      } else {
        // Draw circle under mouse
        p.fill(0, 0, 0);
        p.ellipse(p.mouseX - p.width / 2, p.mouseY - p.height / 2, 20, 20);
      }
    };
  };

  let myp5 = new p5(sketch, wrapper);
};

const generateLabels = () => {
  const labelWrapper = document.querySelector(".js-stat-label-wrapper");
  const labelTemplate = document.querySelector(
    ".js-stat-label-wrapper template"
  ).content;

  data.items.forEach((item) => {
    const element = labelTemplate
      .cloneNode(true)
      .querySelector(".js-stat-label");
    element.style.setProperty(
      "--color",
      `hsl(${item.color[0]}, ${item.color[1]}%, ${item.color[2]}%)`
    );
    element.querySelector('[data-key="value"]').textContent =
      Math.round(item.percentage * 10_000) / 100;
    labelWrapper.appendChild(element);
  });
};

export const setupChart = async () => {
  await loadData();
  generateChart();
  generateLabels();
};
