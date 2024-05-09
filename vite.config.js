// import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  base: '/low-code-demo',
  plugins: [
    vue(),
    vueJsx(),
    Components({
      // extensions: ['vue'],
      // deep: true,
      // dirs: ['src/components/Custom'],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
      directoryAsNamespace: true,
      // dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
