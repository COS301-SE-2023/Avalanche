import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config;
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  env: {
    baseURL : "127.0.0.1",
    basePort : "3000",
    username : "kihale5691@sportrid.com",
    password : "12345"
  }
});
