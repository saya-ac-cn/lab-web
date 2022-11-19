import {defineConfig} from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import react from '@vitejs/plugin-react'
import * as path from "path";
//const baseUrl = import.meta.env.VITE_APP_PROXY_URL

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 配置别名，@作为src引入
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    //host: '0.0.0.0',
    proxy: {
      '/frontend': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        //rewrite: path => path.replace(/^\/api/, '')
      },
      '/warehouse/picture':{
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    vitePluginImp({
      libsList: [
        {
          libName: 'antd',
          libraryDirectory:'es',
          style: (name) => {
            return true;//`antd/es/${name}/style`
          }
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@primary-color': '#b5d780',
        },
        javascriptEnabled: true
      }
    }
  }
})