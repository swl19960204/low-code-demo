import { defineAsyncComponent } from 'vue'

const components = [
    'CircleShape',
    'VImage',
    // 'VText',
    'VButton',
    'Group',
    // 'RectShape',
    // 'LineShape',
    'VTable',
    // 'VChart',
]

export const registerCustomComp = {
    install: (app) => {
        components.forEach(key => {
            app.component(key, defineAsyncComponent(() => import(`./${key}/index.vue`)))
            app.component(key + 'Attr', defineAsyncComponent(() => import(`./${key}/Attr.vue`)))
        })
    }
}