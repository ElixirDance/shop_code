<template>
    <ThemeTogglePopup v-if="isPro()"></ThemeTogglePopup>
    <Component></Component>
</template>

<script setup lang="ts">
import { onMounted, watch, defineAsyncComponent, shallowRef } from "vue";
import { ThemeTogglePopup } from "@/components/themetogglepopup";
import { useThemeStore } from "@/store/theme";
import { isPro } from "@/utils/version";
const themeStore = useThemeStore();
const Component = shallowRef();
const _import = (path: string) => defineAsyncComponent(() => import(`./lib/components/${path}/View.vue`));
watch(
    () => themeStore.themeInfo.layout,
    (value) => {
        if (window.innerWidth < 768) {
            Component.value = _import("default");
        } else {
            Component.value = _import(value);
        }
    },
    { immediate: true }
);
onMounted(() => {
    if (isPro()) {
        themeStore.getThemeInfo();
    } else {
        const data = {
            layout: "default",
            navTheme: "dark",
            primaryColor: "blue",
            uniqueOpened: false
        };
        Object.assign(themeStore.themeInfo, data);
    }
});
</script>
