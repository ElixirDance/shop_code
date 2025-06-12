<template>
    <el-form label-width="auto"> </el-form>
    <div class="right-body">
        <div class="title">
            <div class="left-div">
                <el-checkbox :model-value="isCheckAll" @update:model-value="handleCheckAll" :indeterminate="isCheckAllIndeterminate">
                    <span style="font-weight: 500">全选</span>
                </el-checkbox>
            </div>
            <div class="right-div">权限列表</div>
        </div>
        <a-spin :spinning="loading" style="width: 100%; margin-top: 100px"></a-spin>
        <template v-if="!loading">
            <div v-for="item in authorityList" :key="item.authorityId" class="info">
                <div class="left-div">
                    <el-checkbox
                        :model-value="isChildAllChecked(item)"
                        :indeterminate="isChildIndeterminate(item)"
                        @update:model-value="(e: any) => handleCheckChildAll(e, item)"
                    >
                        <span style="font-weight: 500">{{ item.authorityName }}</span>
                    </el-checkbox>
                </div>
                <div class="right-div">
                    <div class="child-div" v-for="value in item.children" :key="value.authorityId">
                        <el-checkbox
                            :indeterminate="isChildIndeterminate2(value)"
                            :model-value="isChildAllChecked2(value)"
                            @update:model-value="(e: any) => handleCheckChildAll2(e, value, item)"
                        >
                            <el-dropdown v-if="value.childAuth && value.childAuth.length > 0" :hide-on-click="false">
                                <span
                                    >{{ value.authorityName }}<el-icon class="el-icon--right"><arrow-down /></el-icon
                                ></span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <el-checkbox
                                                style="width: 100%"
                                                :model-value="isChildAllChecked2(value)"
                                                :indeterminate="isChildIndeterminate2(value)"
                                                @update:model-value="(e: any) => handleCheckChildAll2(e, value, item)"
                                            >
                                                <span style="font-weight: 500">{{ value.authorityName }}</span>
                                            </el-checkbox>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-for="auth in value.childAuth" @click.native="() => {}">
                                            <el-checkbox
                                                style="width: 100%"
                                                :model-value="isChildChecked(auth)"
                                                @update:model-value="(e: any) => handleChildChecked(e, auth)"
                                            >
                                                <span style="font-weight: 500">{{ auth.authName }}</span>
                                            </el-checkbox>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <span v-else>{{ value.authorityName }}</span>
                        </el-checkbox>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { AuthorityFormState } from "@/types/authority/authority";
import { getAllAuthority } from "@/api/authority/authority";
import { message } from "ant-design-vue";
import { ArrowDown, SemiSelect, Select } from "@element-plus/icons-vue";

const props = defineProps({
    modelValue: { type: Array, default: [] }
});
const loading = ref<boolean>(true);
const checkAll = ref(false);
const isCheckAll = computed(() => {
    return props.modelValue.includes("all");
});
const isCheckAllIndeterminate = computed(() => {
    return props.modelValue.length > 0 && !props.modelValue.includes("all");
});
const handleCheckAll = (e: any) => {
    console.log(e);
    if (e === false) {
        emit("update:modelValue", []);
    } else {
        emit("update:modelValue", ["all"]);
    }
};
// 有all且取消某一个子菜单时
const returnCheckedIfAll = () => {
    if (props.modelValue.includes("all")) {
        const authoritySns: string[] = authorityList.value.flatMap((item: any) => {
            const AuthSNs = item.children
                ? item.children.flatMap((authority: any) => {
                      const childAuthSNs = authority.childAuth?.map((child: any) => child.authSn) || [];
                      return [authority.authoritySn, ...childAuthSNs];
                  })
                : [];
            return [...AuthSNs, ...[item.authoritySn]];
        });
        return authoritySns;
        // emit("update:modelValue", authoritySns);
    } else {
        return props.modelValue;
    }
};

// ****************一级菜单****************
const handleCheckChildAll = (e: any, item: any) => {
    let resultArray = <any>[];
    resultArray = returnCheckedIfAll();
    const authoritySns: string[] = item.children
        ? item.children.flatMap((authority: any) => {
              const childAuthSNs = authority.childAuth?.map((child: any) => child.authSn) || [];
              return [authority.authoritySn, ...childAuthSNs];
          })
        : [];
    authoritySns.unshift(item.authoritySn);
    if (e === false) {
        resultArray = resultArray.filter((auth: any) => !authoritySns.includes(auth));
    } else {
        resultArray = Array.from(new Set([...resultArray, ...authoritySns]));
    }
    emit("update:modelValue", resultArray);
};
const isChildAllChecked = (item: any) => {
    if (props.modelValue.includes("all")) {
        return true;
    }
    const authoritySns: string[] = item.children
        ? item.children.flatMap((authority: any) => {
              const childAuthSNs = authority.childAuth?.map((child: any) => child.authSn) || [];
              return [authority.authoritySn, ...childAuthSNs];
          })
        : [];
    authoritySns.unshift(item.authoritySn);
    return authoritySns.every((element) => props.modelValue.includes(element));
};
const isChildIndeterminate = (item: any) => {
    const authoritySns: string[] = item.children
        ? item.children.flatMap((authority: any) => {
              const childAuthSNs = authority.childAuth?.map((child: any) => child.authSn) || [];
              return [authority.authoritySn, ...childAuthSNs];
          })
        : [];
    authoritySns.unshift(item.authoritySn);
    return !authoritySns.every((element) => props.modelValue.includes(element)) && authoritySns.some((element) => props.modelValue.includes(element));
};
//****************二级菜单********************
const handleCheckChildAll2 = (e: any, item: any, parentItem: any) => {
    let resultArray = <any>[];
    resultArray = returnCheckedIfAll();
    const authoritySns: string[] = item.childAuth?.map((child: any) => child.authSn);
    // 父级加入数组
    authoritySns.unshift(item.authoritySn);

    // 合并结果
    if (e === false) {
        resultArray = resultArray.filter((auth: any) => !authoritySns.includes(auth));
    } else {
        resultArray = Array.from(new Set([...[parentItem.authoritySn], ...resultArray, ...authoritySns]));
    }

    //一级菜单：只要有任何一个子级存在，则要加入结果
    const parentAuthoritySns: string[] = parentItem.children?.map((child: any) => child.authoritySn);
    console.log(parentItem.authoritySn);
    if (parentAuthoritySns.some((element) => resultArray.includes(element))) {
        resultArray = Array.from(new Set([...resultArray, ...[parentItem.authoritySn]]));
    } else {
        resultArray = resultArray.filter((element: any) => element !== parentItem.authoritySn);
    }
    emit("update:modelValue", resultArray);
};
const isChildAllChecked2 = (item: any) => {
    if (props.modelValue.includes("all")) {
        return true;
    }
    const authoritySns: string[] = item.childAuth ? item.childAuth?.map((child: any) => child.authSn) : [];
    authoritySns.unshift(item.authoritySn);
    return authoritySns.every((element) => props.modelValue.includes(element));
};
const isChildIndeterminate2 = (item: any) => {
    const authoritySns: string[] = item.childAuth ? item.childAuth?.map((child: any) => child.authSn) : [];
    authoritySns.unshift(item.authoritySn);
    return !authoritySns.every((element) => props.modelValue.includes(element)) && authoritySns.some((element) => props.modelValue.includes(element));
};
//****************三级菜单****************
const isChildChecked = (item: any) => {
    if (props.modelValue.includes("all")) {
        return true;
    }
    if (props.modelValue.includes(item.authSn)) {
        return true;
    }
    return false;
};
const handleChildChecked = (e: any, item: any) => {
    let resultArray = <any>[];
    resultArray = returnCheckedIfAll();
    if (e === false) {
        resultArray = resultArray.filter((element: any) => element !== item.authSn);
    } else {
        resultArray = Array.from(new Set([...resultArray, ...[item.authSn]]));
    }
    emit("update:modelValue", resultArray);
};

const emit = defineEmits(["update:modelValue"]);
const authorityList = ref<AuthorityFormState[]>([]);

const getAllAuthorityList = async () => {
    try {
        const result = await getAllAuthority({ type: 1 });
        authorityList.value = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    getAllAuthorityList().then(() => {});
});
</script>

<style lang="less" scoped>
.right-body {
    display: flex;
    width: 100%;
    flex-direction: column;

    .title {
        height: 60px;
        background-color: #f5f6fa;
        display: flex;
        flex-direction: row;
        padding: 16px;
        box-sizing: border-box;
        font-weight: 500;
    }

    .left-div {
        min-width: 170px;
        font-weight: 500;
    }

    .info {
        padding: 16px;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #f0f0f0;
    }

    .right-div {
        display: flex;
        width: 100%;
        flex-wrap: wrap; /* 允许项目换行 */
        justify-content: flex-start; /* 项目在主轴上的对齐方式 */
    }

    .right-div > div {
        width: calc(25%); /* 四个项目占满 100% 宽度，减去一些边距 */
    }
}
</style>
