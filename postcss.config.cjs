const cssnano = require("cssnano");
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-nested"),
    cssnano(),
  ],
}
