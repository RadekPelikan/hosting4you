const tableValueElements = document.querySelectorAll(".js-table-value");
let values = [];

const valueToPx = (value) => {
  return `${(1 - value) * tableValueElements[0].clientWidth}px`;
};

const loadValues = async () => {
  const response = await fetch("/assets/json/table.json");
  const data = await response.json();
  values = data;
  return 1;
};

const generateTableValues = () => {
  tableValueElements.forEach((element, index) => {
    element.style.setProperty("--right", valueToPx(values[index].value));
  });
};

export const setupTable = async () => {
  await loadValues();
  generateTableValues();
};
