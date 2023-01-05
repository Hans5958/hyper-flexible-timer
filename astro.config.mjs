import { defineConfig } from 'astro/config';

// https://astro.build/config
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [vue(), tailwind()],
});