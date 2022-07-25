/**
 * ts引入.vue文件
 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>
    export default component
}