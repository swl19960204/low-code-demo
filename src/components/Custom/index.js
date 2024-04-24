import { defineAsyncComponent } from 'vue'

// const components = [
//     // 'CircleShape',
//     // 'VImage',
//     // 'VText',
//     // 'VButton',
//     // 'Group',
//     // 'RectShape',
//     // 'LineShape',
//     'VTable',
//     // 'VChart',
// ];

// import VTable from './VTable/Component.vue';
// export const registerCustomComp = (app) => {
// components.forEach(key => {
//     console.log("🚀 ~ registerCustomComp ~ key:", key)
//     app.component(key, () => import(`./${key}/Component.vue`).default)
//     // app.component(key + 'Attr', () => import(`./${key}/Attr`))
// })
// app.component('VTable', VTable)
// }
export const registerCustomComp = {
    install: (app) => {
        // import.meta.glob是vite的新api
        const components = import.meta.glob("./*/**.vue");
        console.log("🚀 ~ components:", components)
        // 遍历组件模块实现自动注册
        for (const [path, component] of Object.entries(components)) {
            console.log("🚀 ~ path:", path)
            // const componentName = path.match(/\/([^\/]+)\/[^\/]+\.vue$/)[1];
            console.log("🚀 ~ component:", component)
            const folderNameMatch = path.match(/\.\/(.*?)\/.+/);
            const attrNameMatch = path.match(/\/(\w+).vue$/);
            const folderName = folderNameMatch ? folderNameMatch[1] : null;
            const componentName = attrNameMatch ? attrNameMatch[1] : null;
            if (componentName === 'Component') {
                app.component(folderName, defineAsyncComponent(component));
            } else {
                app.component(folderName + componentName, defineAsyncComponent(component));
            }
        }
    }
}
