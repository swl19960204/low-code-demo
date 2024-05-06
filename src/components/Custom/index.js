import { defineAsyncComponent } from 'vue'


export const registerCustomComp = {
    install: (app) => {
        // import.meta.glob是vite的新api
        const components = import.meta.glob("@/components/Custom/*/**.vue");
        console.log("🚀 ~ components:", components)
        // 遍历组件模块实现自动注册
        for (const [path, component] of Object.entries(components)) {

            // 使用正则表达式匹配路径中的组件前缀和文件名
            const match = path.match(/\/([^/]+)\/(V[^/]+)\//);
            if (!match) {
                throw new Error('路径格式不正确或未找到组件前缀');
            }
            // 提取组件前缀和文件名
            const [_, componentName, prefix] = match;
            // 从路径中提取原始文件名
            const originalFileName = path.split('/').pop();
            // 分离文件扩展名
            const baseName = originalFileName.split('.')[0];
            if (baseName === 'index') {
                app.component(prefix, defineAsyncComponent(component));
            } else {
                app.component(`${prefix}${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`, defineAsyncComponent(component));
            }
            // const folderNameMatch = path.match(/\.\/(.*?)\/.+/);
            // const attrNameMatch = path.match(/\/(\w+).vue$/);
            // const folderName = folderNameMatch ? folderNameMatch[1] : null;
            // const componentName = attrNameMatch ? attrNameMatch[1] : null;

            // if (componentName === 'index') {
            //     app.component(folderName, defineAsyncComponent(component));
            // } else {
            //     app.component(folderName + componentName, defineAsyncComponent(component));
            // }
        }
    }
}
