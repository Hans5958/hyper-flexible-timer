import { defineConfig } from 'astro/config';

// https://astro.build/config
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

export default defineConfig({
  integrations: [vue(), tailwind(), icon()],
  base: '/hyper-flexible-timer'
});