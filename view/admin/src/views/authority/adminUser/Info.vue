<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <el-form v-if="!loading" ref="formRef" :model="formState" label-width="auto">
                    <el-form-item
                        :rules="[{ required: true, message: (adminType == 'shop' ? '员工名称' : '管理员名称') + '不能为空!' }]"
                        :label="adminType == 'shop' ? '员工名称' : '管理员名称'"
                        prop="username"
                    >
                        <TigInput width="100%" v-model="formState.username" />
                    </el-form-item>
                    <el-form-item v-if="adminType == 'admin'" label="手机号" prop="mobile" :rules="[{ required: true, message: '手机号不能为空!' }]">
                        <TigInput width="100%" v-model="formState.mobile" />
                    </el-form-item>
                    <el-form-item v-if="adminType != 'shop'" label="邮箱" prop="email">
                        <TigInput width="100%" v-model="formState.email" />
                    </el-form-item>
                    <el-form-item v-if="adminType != 'shop'" label="头像" prop="avatar">
                        <UploadAvatar v-model:avatar="formState.avatar" :avatarType="avatarType" :loading="loading"></UploadAvatar>
                    </el-form-item>
                    <template v-if="operation == 'create' && adminType != 'shop'">
                        <el-form-item :rules="[{ required: true, message: '设置密码不能为空!' }]" label="设置密码" prop="password">
                            <TigInput width="100%" v-model="formState.password" type="password" />
                        </el-form-item>
                        <el-form-item :rules="[{ required: true, message: '确认密码不能为空!' }]" label="确认密码" prop="pwdConfirm">
                            <TigInput width="100%" v-model="formState.pwdConfirm" type="password" />
                        </el-form-item>
                    </template>
                    <template v-else-if="adminType == 'shop'">
                        <el-form-item label="修改密码" prop="password">
                            <TigInput width="100%" v-model="formState.password" type="password" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="pwdConfirm">
                            <TigInput width="100%" v-model="formState.pwdConfirm" type="password" />
                        </el-form-item>
                    </template>
                    <el-form-item v-if="adminType != 'shop'" :label="adminType == 'shop' ? '员工权限组' : '管理员权限组'" prop="roleId">
                        <template v-if="formState.roleId != 2">
                            <el-select v-model="formState.roleId" style="width: 100%">
                                <el-option :value="0" label="自定义权限"></el-option>
                                <el-option v-for="item in roleList" :label="item.roleName" :value="item.roleId"></el-option>
                            </el-select>
                        </template>
                        <template v-else> 供应商</template>
                    </el-form-item>
                    <el-form-item v-if="formState.roleId === 0 && adminType != 'shop'" label="" prop="authList">
                        <AuthoritySelect v-model="formState.authList"></AuthoritySelect>
                    </el-form-item>
                    <el-form-item v-if="adminType == 'shop'" label="店铺列表" prop="userShop">
                        <el-table :data="formState.userShop" row-key="id">
                            <el-table-column label="店铺logo" prop="username">
                                <template #default="{ row }">
                                    <el-avatar :size="40" :src="imageFormat(row.shop?.shopLogo)" />
                                </template>
                            </el-table-column>
                            <el-table-column label="所属店铺" prop="username">
                                <template #default="{ row }">
                                    {{ row.shop?.shopTitle }}
                                </template>
                            </el-table-column>
                            <el-table-column width="100" label="状态" prop="username">
                                <template #default="{ row }">
                                    {{ row.shop?.statusText }}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column width="100" label="头像" prop="avatar">
                                <template #default="{ row }">
                                    <template v-if="extractContent(String(row.user.avatar)) == 'one'">
                                        <el-avatar :size="30" :src="imageFormat(row.user.avatar)" />
                                    </template>
                                    <template v-else-if="extractContent(String(row.user.avatar)) == 'def'">
                                        <el-avatar :size="30" :src="returnAvatar(row.user.avatar)" />
                                    </template>
                                    <template v-else>
                                        <el-avatar :size="30" src="" />
                                    </template>
                                </template>
                            </el-table-column> -->
                            <el-table-column width="100" label="员工昵称" prop="username">
                                <template #default="{ row }">
                                    {{ row.username || formState.username || "-" }}
                                </template>
                            </el-table-column>
                            <el-table-column label="联系方式" prop="username">
                                <template #default="{ row }">
                                    {{ row.user?.mobile || "-" }}
                                </template>
                            </el-table-column>
                            <template #empty>
                                <div class="empty-warp">
                                    <div v-if="!loading" class="empty-bg">暂无数据</div>
                                </div>
                            </template>
                        </el-table>
                    </el-form-item>
                    <el-form-item v-show="!props.isDialog" :wrapper-col="{ offset: 4, span: 16 }">
                        <el-button ref="submitBtn" class="form-submit-btn" type="primary" @click="onSubmit">提交</el-button>
                    </el-form-item>
                </el-form>
                <a-spin :spinning="loading" style="width: 100%; margin-top: 100px" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { imageFormat } from "@/utils/format";
import { returnAvatar } from "@/utils/avatar";
import { DefaultAvatar, FormAddGallery, UploadAvatar } from "@/components/gallery";
import { AdminUserFormState, AdminUserRoleListItem } from "@/types/authority/adminUser";
import { getAdminUser, updateAdminUser, getAdminUserConfig, getAdminUserSearch } from "@/api/authority/adminUser";
import AuthoritySelect from "@/views/authority/AuthoritySelect.vue";
import { extractContent } from "@/utils/util";
// 父组件回调
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close"]);
const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    suppliersId: {
        type: Number,
        default: 0
    },
    act: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    adminType: {
        type: String,
        default: "admin"
    },
    isDialog: Boolean
});

const loading = ref<boolean>(true);
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : "update";
const formRef = shallowRef();
const formState = reactive<AdminUserFormState>({
    userId: ""
});
const roleList = ref<AdminUserRoleListItem[]>();
const userInfo = ref<any>({});
const remoteMethod = async (query: string) => {
    if (query) {
        const result = await getAdminUserSearch(query);
        if (result !== null) {
            userInfo.value = result;
        }
    } else {
        userInfo.value = {};
    }
};
const avatarType = ref(true);
const fetchAdminUser = async () => {
    try {
        const result = await getAdminUser(action.value, { id: id.value });
        userInfo.value = result.user;
        Object.assign(formState, result);
        if (!roleList.value?.some((item) => item.roleId === formState.roleId)) {
            formState.roleId = 0;
        }
        formState.mobile = result.adminUser?.mobile || result.mobile;
        let temp = extractContent(String(formState.avatar));
        if (temp == "one") {
            avatarType.value = true;
        } else if (temp == "def") {
            avatarType.value = false;
        }
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};
const fetchAdminUserConfit = async () => {
    try {
        const result = await getAdminUserConfig();
        roleList.value = result;
    } catch (error: any) {
        message.error(error.message);
    }
};

onMounted(() => {
    fetchAdminUserConfit();
    if (action.value === "detail") {
        // 获取详情数据
        fetchAdminUser();
    } else {
        loading.value = false;
    }
    if (operation != "update" && props.type === "suppliers") {
        formState.roleId = 2;
        formState.suppliersId = props.suppliersId;
    }
});

// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    try {
        emit("update:confirmLoading", true);
        let temp: any = {
            avatar: ""
        };
        if (!formState.avatar && formState.defAvatar) {
            temp.avatar = formState.defAvatar;
        } else {
            temp.avatar = formState.avatar;
        }
        const result = await updateAdminUser(operation, { id: id.value, ...formState, avatar: temp.avatar });
        emit("submitCallback", result);
        message.success("操作成功");
    } catch (error: any) {
        message.error(error.message);
    } finally {
        emit("update:confirmLoading", false);
    }
};
// 表单提交
const onFormSubmit = () => {
    onSubmit();
};

defineExpose({ onFormSubmit });
</script>
<style lang="less" scoped>
.width100 {
    width: 100%;
}
</style>
