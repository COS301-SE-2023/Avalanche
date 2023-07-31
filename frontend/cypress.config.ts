import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config;
    },
  },
  video: false,
  screenshotOnRunFailure: false,
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
