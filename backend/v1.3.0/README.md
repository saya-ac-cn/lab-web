### backend-v1 后台管理模板（按照Google mail风格进行改良重写）

#### 项目创建步骤：

##### 1、创建项目

```shell
mkdir backend-v1
cd backend-v1
# 根据提示选择配置即可 
npm init vite@latest
```

#### 2、安装antd
```shell
npm install antd --save
```

#### 3、配置alias别名 @
配置别名 像vue cli一样 以@引入文件
vite.config.js
```shell
    resolve: {
        // 配置别名，@作为src引入
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
```
配置了@别名之后去引入文件发现没有智能提示，需要根目录添加一个jsconfig.json文件
```js
{
  "compilerOptions": {
      "baseUrl": "./",
      "paths": {
          "@/*": ["src/*"]
      }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 4、配置proxy代理
vite.config.js中配置server
```js
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://10.0.40.200:8979',
                ws: false,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
```

#### 5、配置按需引入
```shell
npm install vite-plugin-imp -D
```
参考
https://blog.csdn.net/AK852369/article/details/124195919
```js
import vitePluginImp from 'vite-plugin-imp'
    plugins: [
        react(),
        vitePluginImp({
            libsList: [
                {
                    libName: 'antd',
                    style: (name) => {
                        return `antd/es/${name}/style`
                    }
                }
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    // 更改主题在这里
                    'primary-color': '#52c41a',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px'
                },
                javascriptEnabled: true
            }
        }
    }
```

#### 5、配置环境变量
vite 提供了开发模式和生产模式
这里我们可以建立 4 个 .env 文件，一个通用配置和三种环境：开发、生产。 env文件中的变量名建议以VITE_APP开头，和vue cli中的VUE_APP相同 ，用法也一致
- .env文件 通用配置 用来配置一些公用的，栗子：网页的title VITE_APP_TITLE=hello
- .env.dev文件 开发环境配置 以api url为例 VITE_APP_PROXY_URL=/api
- .env.prod文件 测试环境配置 以api url为例 VITE_APP_PROXY_URL=/apiProd

在写api的时候可以这么使用
```js
const baseUrl = import.meta.env.VITE_APP_PROXY_URL
export const getTabList = (params) => {
  return axios({
    method: 'post',
    url: baseUrl + 'QueryTabReq',
    data: params
  })
}
```
package.json
```js
  "scripts": {
    "dev": "vite --mode dev",
    "build": "vite build --mode prod",
    "preview": "vite preview"
  }
```

#### 6、安装路由
```shell
npm install react-router -D
npm install react-router-dom -D
```

#### 7、安装less
```shell script
  npm install less less-loader
```

#### 8、安装react-document-title用于设置页面标题
```shell script
   npm install react-document-title
```

#### 9、安装 axios
```shell script
    npm install axios
```

#### 10、安装jwt
```shell
  npm install jwt-decode
```

#### 11、安装 store
```shell
    npm install store -D
```

#### 12、安装图片裁剪
```shell
    npm install react-cropper
```

#### 13、安装for-editor（MarkDown）
```shell
    npm install for-editor
```

#### ant-design日期组件DatePicker国际化失效
参考 https://blog.csdn.net/u012889686/article/details/126611268
```javascript
import 'moment/dist/locale/zh-cn';
```

https://zhuanlan.zhihu.com/p/456407867
https://blog.csdn.net/weixin_42164539/article/details/123388542
