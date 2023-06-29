const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
    
  },
  env: {
    baseurl:'http://localhost:8080/api',
    officeCode: 3,
  },
});
