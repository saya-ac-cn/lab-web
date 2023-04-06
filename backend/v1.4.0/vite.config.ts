import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/


export default ({mode}) => {
  const env = loadEnv(mode,process.cwd());
  console.error('env',env)
  return defineConfig({
    plugins: [
      react()
    ],
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'./src')
      }
    },
    server: {
      host: "0.0.0.0", // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      port: 3000, //指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口
      proxy: {
        '/backend': {
          target: env.VITE_APP_PROXY_URL,
          changeOrigin: true,
          //rewrite: path => path.replace(/^\/api/, "") //因为实际的地址不带api，所以要去掉api
        },
        '/warehouse/picture':{
          target: env.VITE_APP_PROXY_URL,
          changeOrigin: true,
        }
      }
    },
  })
}
