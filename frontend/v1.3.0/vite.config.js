import {defineConfig, loadEnv} from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import react from '@vitejs/plugin-react'
import * as path from "path";
import {resolve} from "uri-js";
export default ({mode}) => {
  const env = loadEnv(mode,process.cwd());
  return defineConfig({
    //项目根目录
    root: process.cwd(),
    //项目部署的基础路径
    base: "/",
    //静态资源服务的文件夹
    publicDir: "public",
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
          target: env.VITE_APP_PROXY_URL,
          changeOrigin: true,
          //rewrite: path => path.replace(/^\/api/, '')
        },
        '/warehouse/picture':{
          target: env.VITE_APP_PROXY_URL,
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
              return `antd/es/${name}/style`;
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
    },
    build:{
      chunkSizeWarningLimit:1024,
      assetsDir:"static",
      rollupOptions: {
        output:{
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      },
      chunkFileNames: (chunkInfo) => {
        const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/')
            : [];
        const fileName =
            facadeModuleId[facadeModuleId.length - 2] || '[name]';
        return `js/${fileName}/[name].[hash].js`;
      }
    }
  })
}