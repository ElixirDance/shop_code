<template>
    <el-color-picker v-model="color" show-alpha :predefine="predefineColors"/>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
const color = defineModel<string>("color", { default:''});
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
</script>

<style lang="less" scoped>
</style>
