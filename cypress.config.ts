import { defineConfig } from "cypress";
import path from "path";

export default defineConfig({
  component: {
    devServer: {
      framework: "cypress-ct-lit" as any,
      bundler: "vite",
      // viteConfig: {
      //   configFile: './vite.config.ts'
      // }
    },
    specPattern: 'cypress/component/**/*.cy.{js,ts}',
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
