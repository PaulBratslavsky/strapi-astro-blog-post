const readingTime = require("reading-time");

module.exports = {
  async beforeCreate(event) {
    console.log("########## BEFORE CREATE ##########");
    if (event.params.data.content) {
      event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
    }
  },

  async beforeUpdate(event) {
    console.log("########## BEFORE UPDATE ##########");
    if (event.params.data.content) {
      event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
    }
  },
};
