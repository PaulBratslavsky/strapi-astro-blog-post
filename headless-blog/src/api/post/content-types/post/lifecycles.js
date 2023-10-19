const readingTime = require("reading-time");

module.exports = {
  async beforeCreate(event) {
    console.log("########## BEFORE CREATE ##########");
    console.log(event);
    console.log(event.model.uid);
    console.log(event.params.data);

    event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
  },

  async beforeUpdate(event) {
    console.log("########## BEFORE UPDATE ##########");
    console.log(event);
    console.log(event.model.uid);
    console.log(event.params.data);

    event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
  },
};
