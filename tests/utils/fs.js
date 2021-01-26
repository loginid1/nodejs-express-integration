const { writeFile } = require("fs/promises");
const { join } = require("path");

const writeImage = (name) => (image) => {
  return writeFile(join(__dirname, "..", "images", name), image, "base64");
};

module.exports = { writeImage };
