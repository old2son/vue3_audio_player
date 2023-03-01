import { defineConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
	base: isProduction ? './' : '',
	mode: 'development',
	define: '',
	publicDir: 'assets',
	resolve: {
		// 目录别名
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	css: {
		postcss: {
			plugins: [],
		},
	},
	build: {
		// 压缩
		minify: 'esbuild',
		assetsDir: '',
		outDir: `./dist/${process.env.VITE_ENV}`,
		sourcemap: true,
		// 进行压缩计算
		brotliSize: false,
	},
	server: {
		host: '0.0.0.0',
		port: '81',
	},
	plugins: [
		vue(),
		viteMockServe({
			supportTs: false,
		}),
	],
});
