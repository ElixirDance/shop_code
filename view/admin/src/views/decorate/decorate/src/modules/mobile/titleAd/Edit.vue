<template>
    <perfect-scrollbar class="decorate-edit-con">
        <div class="dec-edit-title">
            <h3>文本标题</h3>
        </div>
        <CommonTitleEdit v-model="module.title" type="title" decorateType="mobile"></CommonTitleEdit>
        <CommonFrameEdit v-model="module.frame"></CommonFrameEdit>
        
    </perfect-scrollbar>
</template>
<script lang="ts" setup>
import { SelectColor } from "@/components/select";
import { PicList } from "@/components/decorate";
import { ref, defineModel, reactive } from "vue";
import CommonTitleEdit from "../../src/commonTitle/Edit.vue";
import CommonFrameEdit from "../../src/commonFrame/Edit.vue";
import { ModuleType, ModuleImageType } from "@/types/decorate/decorate.d";
const module = defineModel<ModuleType & ModuleImageType>("module", { default: () => ({}) });
</script>
