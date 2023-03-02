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
		preprocessorOptions: {
			scss: {
				additionalData: `@import '@/styles/_variable.scss';`, // 全局变量获取
			  	// additionalData: `$text-positive: #1ed760;`,
			},
			scss: {
				additionalData: `@use '@/styles/_variable.scss' as *;`, // @use 'sass:math'; 必须最前
			},
		},
		devSourcemap: true
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
