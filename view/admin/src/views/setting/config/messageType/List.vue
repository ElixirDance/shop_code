<template>
    <div class="container">
        <div class="content_wrapper">
            <div class="lyecs-form-table">
                <div class="notice-warp">
                    <strong> 模板行业选择</strong>
                    <p>主营行业：根据您的主营行业选择适合的服务类目</p>
                    <p>副营行业：商业服务 -> 软件/建站/技术开发</p>
                    <strong> 生成小程序消息模板</strong>
                    <p>请先添加服务类目《商业服务->软件/建站/技术开发》，否则模板导入不成功，点击会自动删除原有的小程序模板并生成新的模板！</p>
                    <!--                    <strong> 同步小程序消息模板</strong>-->
                    <!--                    <p> 请先点击生成小程序模板，小程序后台已自动添加模板。点击同步则会将生成的模板导入到数据库。检查消息模板ID与小程序后台模板ID是否一致即可！</p>-->
                    <strong> 生成公众号模板消息</strong>
                    <p>请先添加服务类目《商业服务->软件/建站/技术开发》，否则模板导入不成功，点击会自动删除原有的公众号模板并生成新的模板！</p>
                    <!--                    <strong> 同步公众号模板消息</strong>-->
                    <!--                    <p> 请先点击生成公众号模板消息，点击同步则会将生成的模板导入到数据库。检查消息模板ID与公众号后台模板ID是否一致即可！</p>-->
                </div>
                <el-tabs v-model="activeKey" class="lyecs-tabs" tab-position="top" @tab-change="onTabChange">
                    <el-tab-pane label="发送给用户" :name="1"></el-tab-pane>
                    <el-tab-pane label="发送给商家" :name="2"></el-tab-pane>
                    <div>
                        <el-space>
                            <el-button type="primary" @click="generate()">生成小程序消息模板</el-button>
                            <!--                            <el-button type="success" @click="synchronization()">同步小程序消息模板</el-button>-->
                            <el-button type="warning" @click="generateWechat()">生成公众号模板消息</el-button>
                            <!--                            <el-button type="danger" @click="synchronizationWechat()">同步公众号模板消息</el-button>-->
                            <TigInput v-model="filterParams.keyword" placeholder="输入关键字" @keyup.enter="onSearchSubmit" clearable @clear="onSearchSubmit">
                                <template #append>
                                    <el-button @click="onSearchSubmit"><span class="iconfont icon-chakan1"></span></el-button>
                                </template>
                            </TigInput>
                        </el-space>
                    </div>
                </el-tabs>
                <div class="table-container">
                    <a-spin :spinning="loading">
                        <el-table
                            :data="filterState"
                            :loading="loading"
                            :total="total"
                            row-key="messageId"
                            @selection-change="onSelectChange"
                            @sort-change="onSortChange"
                        >
                            <el-table-column label="消息类型" prop="name">
                                <template #default="{ row }">
                                    <PopForm
                                        v-model:org-value="row.name"
                                        :params="{ id: row.messageId, field: 'name' }"
                                        :requestApi="updateMessageTypeFiled"
                                        label="消息类型"
                                        type="input"
                                    >
                                        <div>{{ row.name }}</div>
                                    </PopForm>
                                </template>
                            </el-table-column>
                            <el-table-column label="消息描述" prop="describe"></el-table-column>
                            <el-table-column label="站内信" width="100">
                                <template #default="{ row }">
                                    <Switch
                                        v-if="row.isMessage > -1"
                                        v-model:checked="row.isMessage"
                                        :params="{ id: row.messageId, field: 'isMessage' }"
                                        :requestApi="updateMessageTypeFiled"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="短信" width="100">
                                <template #default="{ row }">
                                    <Switch
                                        v-if="row.isMsg > -1"
                                        v-model:checked="row.isMsg"
                                        :params="{ id: row.messageId, field: 'isMsg' }"
                                        :requestApi="updateMessageTypeFiled"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="公众号" width="100">
                                <template #default="{ row }">
                                    <Switch
                                        v-if="row.isWechat > -1"
                                        v-model:checked="row.isWechat"
                                        :params="{ id: row.messageId, field: 'isWechat' }"
                                        :requestApi="updateMessageTypeFiled"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="小程序" width="100">
                                <template #default="{ row }">
                                    <Switch
                                        v-if="row.isMiniProgram > -1"
                                        v-model:checked="row.isMiniProgram"
                                        :params="{ id: row.messageId, field: 'isMiniProgram' }"
                                        :requestApi="updateMessageTypeFiled"
                                    />
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="APP" width="100">
                                <template #default="{ row }">
                                    <Switch v-if="row.isApp>-1" v-model:checked="row.isApp" :params="{ id: row.messageId, field: 'isApp' }" :requestApi="updateMessageTypeFiled"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="钉钉" width="100">
                                <template #default="{ row }">
                                    <Switch v-if="row.isDing>-1" v-model:checked="row.isDing" :params="{ id: row.messageId, field: 'isDing' }" :requestApi="updateMessageTypeFiled"/>
                                </template>
                            </el-table-column> -->
                            <el-table-column :width="100" fixed="right" label="操作">
                                <template #default="{ row }">
                                    <DialogForm
                                        :params="{ act: 'detail', id: row.messageId }"
                                        isDrawer
                                        path="setting/config/messageType/Info"
                                        title="编辑消息设置"
                                        width="700px"
                                        @okCallback="loadFilter"
                                    >
                                        <a class="btn-link">编辑</a>
                                    </DialogForm>
                                </template>
                            </el-table-column>
                            <template #empty>
                                <div class="empty-warp">
                                    <div v-if="!loading" class="empty-bg">暂无数据</div>
                                </div>
                            </template>
                        </el-table>
                    </a-spin>
                    <div v-if="total > 0" class="pagination-con">
                        <Pagination v-model:page="filterParams.page" v-model:size="filterParams.size" :total="total" @callback="loadFilter" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import "@/style/css/list.less";
import { DialogForm } from "@/components/dialog";
import { onMounted, reactive, ref } from "vue";
import { Pagination, Switch } from "@/components/list";
import { message, Modal } from "ant-design-vue";
import { useConfigStore } from "@/store/config";
import type { MessageTypeFilterParams, MessageTypeFilterState } from "@/types/setting/messageType.d";
import {
    batchSubmit,
    getMessageTypeList,
    miniProgramMessageTemplate,
    miniProgramMessageTemplateSync,
    updateMessageTypeFiled,
    wechatMessageTemplate,
    wechatMessageTemplateSync
} from "@/api/setting/messageType";
import { PopForm } from "@/components/pop-form";
import type { LogisticsCompanyFilterState } from "@/types/setting/logisticsCompany";

const config: any = useConfigStore();
// 基本参数定义
const filterState = ref<MessageTypeFilterState[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const selectedIds = ref<number[]>([]);
const advancedSearch = ref<boolean>(false);
const filterParams = reactive<MessageTypeFilterParams>({
    page: 1,
    size: config.get("pageSize"),
    sortField: "",
    sortOrder: "",
    keyword: "",
    sendType: 1
});

const activeKey = ref<number>(1);
const onTabChange = (val: number) => {
    console.log(val);
    filterParams.sendType = val;
    loadFilter();
};

// 获取列表的查询结果
const loadFilter = async () => {
    loading.value = true;
    try {
        const result = await getMessageTypeList({ ...filterParams });
        filterState.value = result.records;
        total.value = result.total;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    loadFilter();
});

const generate = async () => {
    Modal.confirm({
        title: "您确认要生成小程序消息模板吗？",
        onOk: async () => {
            try {
                const result = await miniProgramMessageTemplate();
                message.success("操作成功");
                loadFilter();
            } catch (error: any) {
                message.error(error.message);
            } finally {
            }
        }
    });
};

const synchronization = async () => {
    Modal.confirm({
        title: "您确认要同步小程序消息模板吗？",
        onOk: async () => {
            try {
                const result = await miniProgramMessageTemplateSync();
                message.success("操作成功");
                loadFilter();
            } catch (error: any) {
                message.error(error.message);
            } finally {
            }
        }
    });
};

const generateWechat = async () => {
    Modal.confirm({
        title: "您确认要生成公众号模板消息吗？",
        onOk: async () => {
            try {
                const result = await wechatMessageTemplate();
                message.success("操作成功");
                loadFilter();
            } catch (error: any) {
                message.error(error.message);
            } finally {
            }
        }
    });
};

const synchronizationWechat = async () => {
    Modal.confirm({
        title: "您确认要同步公众号模板消息吗？",
        onOk: async () => {
            try {
                const result = await wechatMessageTemplateSync();
                message.success("操作成功");
                loadFilter();
            } catch (error: any) {
                message.error(error.message);
            } finally {
            }
        }
    });
};

// 参数查询
const onSearchSubmit = () => {
    loadFilter();
};
// 修改排序
const onSortChange = ({ prop, order }: { prop: string; order?: string }) => {
    filterParams.sortField = prop;
    filterParams.sortOrder = order == "ascending" ? "asc" : order == "descending" ? "desc" : "";
    loadFilter();
};

// 批量操作
const onBatchSubmit = async (action: string) => {
    try {
        const result = await batchSubmit(action, { ids: selectedIds.value });
        message.success("操作成功");
        loadFilter();
    } catch (error: any) {
        message.error(error.message);
    }
};
// 多选操作
const onSelectChange = (e: MessageTypeFilterState[]) => {
    selectedIds.value = e.map((item) => item.messageId);
};
</script>
<style lang="less" scoped>
.notice-warp {
    background-color: #eef2ff;
    border-radius: 9px;
    padding: 15px;
    margin-bottom: 20px;
    line-height: 24px;
}
</style>
