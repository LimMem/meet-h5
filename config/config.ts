import { defineConfig } from 'alita';
import { join } from 'path';

export default defineConfig({
    appType: 'h5',
    publicPath: './',
    outputPath: '../uniapp/hybrid/html',
    headScripts: [
        { src: 'https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js'}
    ],
    retainLog: true,
});
