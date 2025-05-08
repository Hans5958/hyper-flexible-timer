import { defineConfig } from 'astro/config'

import vue from "@astrojs/vue"
import tailwindcss from '@tailwindcss/vite'
import icon from "astro-icon"

export default defineConfig({
	integrations: [vue(), icon()],
	base: '/hyper-flexible-timer',

	vite: {
		plugins: [tailwindcss()],
	},
})