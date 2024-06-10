import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://52.62.28.42',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
