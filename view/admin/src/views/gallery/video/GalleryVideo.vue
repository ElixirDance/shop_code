<template>
    <div class="gallery_warp" id="gallery_warp">
        <div class="lyecs_gallery_box">
            <div class="gallery-folder-warp">
                <div class="gallery-folder-list">
                    <div :class="'gallery-folder-item ' + (galleryStore.topGalleryId == 0 ? 'current' : '')" v-if="gallery" @click="folderChange(0)">
                        <div class="folder-item-con">
                            <i class="item-ico"></i>
                            <div class="item-name">全部</div>
                        </div>
                    </div>
                    <div :class="'gallery-folder-item ' + (galleryStore.topGalleryId == item.id ? 'current' : '')" v-for="(item, key) in gallery">
                        <div :class="'folder-item-con'" @click="folderChange(item.id)">
                            <i class="item-ico"></i>
                            <div class="item-name">{{ item.name }}</div>
                        </div>
                        <div class="folder-item-edit">
                            <el-dropdown trigger="click">
                                <i title="编辑" class="ico-font">&#xe669;</i>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <DialogForm
                                            width="600px"
                                            @okCallback="editRecordCallback(item.id, true)"
                                            title="编辑相册"
                                            path="gallery/video/GalleryVideoEdit"
                                            :params="{ act: 'detail', id: item.id }"
                                        >
                                            <el-dropdown-item>
                                                <div>编辑相册</div>
                                            </el-dropdown-item>
                                        </DialogForm>
                                        <el-dropdown-item @click="delRootGallery(item.id, key)">
                                            <div>删除</div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
                <div class="add-gallery-folder-con">
                    <DialogForm
                        width="600px"
                        @okCallback="addGalleryCallback(0)"
                        title="添加视频相册"
                        path="gallery/video/GalleryVideoEdit"
                        :params="{ act: 'add', parentId: 0 }"
                    >
                        <el-button class="add-gallery-folder-btn"><em>+</em> 添加视频相册</el-button>
                    </DialogForm>
                </div>
            </div>
            <div class="gallery-pics-warp">
                <div class="gallery-main" id="gallery-main">
                    <div class="gallery-pic-action">
                        <div class="gallery-pic-action-l">
                            <el-space>
                                <DialogForm
                                    width="700px"
                                    @okCallback="galleryChange(galleryStore.galleryId, galleryStore.page)"
                                    title="上传视频"
                                    path="gallery/video/VideoEdit"
                                    :params="{ act: 'add' }"
                                    @callback="addGalleryCallback(0)"
                                >
                                    <el-button type="primary">上传视频</el-button>
                                </DialogForm>
                                <el-button
                                    v-if="galleryInfo && galleryInfo.parentId > 0"
                                    class="lyecs-btn return-gallery-btn"
                                    @click="galleryChange(galleryInfo.parentId)"
                                    >返回上一级</el-button
                                >
                                <DialogForm
                                    v-if="galleryInfo && galleryStore.galleryId > 0"
                                    width="600px"
                                    @okCallback="addGalleryCallback(galleryInfo.id)"
                                    title="添加子相册"
                                    path="gallery/video/GalleryVideoEdit"
                                    :params="{ act: 'add', parentId: galleryInfo.id }"
                                >
                                    <el-button class="lyecs-btn add-gallery-btn">添加子相册</el-button>
                                </DialogForm>
                            </el-space>
                        </div>
                        <div class="gallery-pic-action-r">
                            <span style="word-break: keep-all">排序：</span>
                            <el-select @change="changeSort" class="a-select-ui gallery_pic_sort" v-model="galleryStore.sortOrder">
                                <el-option label="时间从先到后" value="asc" />
                                <el-option label="时间从后到先" value="desc" />
                            </el-select>
                        </div>
                    </div>
                    <a-spin :spinning="loading">
                        <div class="gallery-list" :suppressScrollX="false">
                            <ul v-if="childGalleryList.length > 0 && galleryStore.galleryId > 0">
                                <template v-for="(gallery, key) in childGalleryList" :key="gallery.id">
                                    <li class="gallery-video-item">
                                        <div class="video-item-box" @click="galleryChange(gallery.id)">
                                            <span class="video-empty" v-if="gallery.galleryVideoInfoList.length == 0">相册为空</span>
                                            <template v-for="(galleryPic, k) in gallery.galleryVideoInfoList">
                                                <el-image fit="cover" class="gallery_pics" :src="imageFormat(galleryPic.videoCover)" />
                                            </template>
                                        </div>
                                        <p class="video-actions">
                                            <DialogForm
                                                width="600px"
                                                @okCallback="editRecordCallback(gallery.id, false)"
                                                title="编辑相册"
                                                path="gallery/video/GalleryVideoEdit"
                                                :params="{ act: 'detail', id: gallery.id, parentId: gallery.parentId }"
                                            >
                                                <a class="btn-edit ico-font">&#xe610;</a>
                                            </DialogForm>
                                            <a-popconfirm title="您确认要删掉该相册吗？" @confirm="delGallery(gallery.id, key)" placement="bottom">
                                                <a class="btn-del ico-font" title="删除">&#xe60a;</a>
                                            </a-popconfirm>
                                        </p>
                                        <div class="desc">
                                            {{ gallery.name }}
                                        </div>
                                    </li>
                                </template>
                            </ul>
                            <ul class="gallery-list-ul" v-if="picList.length > 0">
                                <template v-for="(galleryPic, key) in picList">
                                    <li
                                        :class="'gallery-video-item ' + (selectedPics.some((selected: any) => selected.id === galleryPic.id) ? 'selected' : '')"
                                    >
                                        <div>
                                            <div class="video-item-box" @click="selectPic(galleryPic, key)">
                                                <div class="video-item-box-icon">
                                                    <DialogForm
                                                        width="600px"
                                                        @okCallback="editRecordCallback(galleryPic.id, false)"
                                                        title="编辑视频"
                                                        path="gallery/video/VideoEdit"
                                                        :params="{ act: 'detail', id: galleryPic.id }"
                                                    >
                                                        <i class="iconfont-admin icon-shipin"></i>
                                                    </DialogForm>
                                                </div>
                                                <el-image
                                                    v-if="galleryPic.videoCover"
                                                    fit="cover"
                                                    class="gallery_pics"
                                                    style="width: 100%; height: 100%"
                                                    :src="imageFormat(galleryPic.videoCover)"
                                                />
                                                <video v-if="!galleryPic.videoCover" :src="imageFormat(galleryPic.videoUrl)"></video>
                                            </div>
                                            <div class="video-actions">
                                                <div class="flex flex-justify-between" style="width: 100%">
                                                    <p class="duration">{{ galleryPic.duration }}</p>
                                                    <div class="flex">
                                                        <p class="duration">{{ galleryPic.size }}</p>
                                                        <!-- <DialogForm
                                                            width="600px"
                                                            @okCallback="editRecordCallback(galleryPic.id, false)"
                                                            title="编辑视频"
                                                            path="gallery/video/VideoEdit"
                                                            :params="{ act: 'detail', id: galleryPic.id }"
                                                        >
                                                            <a class="btn-edit ico-font">&#xe610;</a>
                                                        </DialogForm> -->
                                                        <a-popconfirm title="您确认要删掉该视频吗？" @confirm="delPic(galleryPic.id)" placement="bottom">
                                                            <a class="btn-del ico-font" title="删除">&#xe60a;</a>
                                                        </a-popconfirm>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="desc">
                                                {{ galleryPic.videoName }}
                                            </div>
                                            <div class="img-selected-box">
                                                <div class="img-selected-box-angle"></div>
                                                <div class="img-selected-box-sort ico-font">&#xe63b;</div>
                                            </div>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                            <div class="empty-warp" v-if="picList.length == 0 && childGalleryList.length == 0">
                                <div v-if="!loading" class="empty-bg">暂无数据</div>
                            </div>
                        </div>
                        <div class="gallery-list-page">
                            <Pagination
                                v-model:page="galleryStore.page"
                                v-model:size="size"
                                :total="picTotal"
                                @callback="pageChange"
                                layout="slot ,prev, pager, next"
                                :background="false"
                            />
                        </div>
                    </a-spin>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, computed, onMounted } from "vue";
import { DialogForm } from "@/components/dialog";
import { message, Modal } from "ant-design-vue";
import { imageFormat } from "@/utils/format";
import { Pagination } from "@/components/list";
import { useGalleryStore } from "@/store/gallery";
import { getGalleryVideoList, getGalleryVideoInfoList, delVideoInfoField, delGalleryVideoInfo } from "@/api/setting/gallery";
import type { GalleryFormState } from "@/types/setting/gallery.d";

const props = defineProps({
    isMultiple: {
        type: Boolean,
        default: false
    }
});
const galleryStore = useGalleryStore();
// 相册目录
const gallery = ref<GalleryFormState[]>([]);
// 当前相册图片列表
const galleryPicList = ref([]);
// 新添加的图片
const uploadPicList = ref<any[]>([]);
// 图片数组
// 当前相册图片数量
const picTotal = ref();
// 当前相册信息
const galleryInfo = ref<any>({});
// 子相册
const childGalleryList = ref<any>([]);
// 是否多选
const { isMultiple } = toRefs(props);
// 已选项-图片
const selectedPics = ref<any>([]);
// 其它
const size = ref(15);
const loading = ref(true);

const picList = computed<any>(() => {
    return uploadPicList.value.concat(galleryPicList.value);
});

// 加载目录和全部相册
const loadGallery = async (galleryId: number) => {
    try {
        const result = await getGalleryVideoList({ galleryId: galleryId });
        Object.assign(gallery.value, result.records);
        galleryChange(galleryId, galleryStore.page);
        loadTopGallery();
    } catch (error: any) {
        message.error(error.message);
    }
};
onMounted(() => {
    loadTopGallery();
});
const loadTopGallery = async () => {
    try {
        const result = await getGalleryVideoList({ galleryId: 0 });
        gallery.value = result.records;
        galleryChange(galleryStore.galleryId, galleryStore.page);
    } catch (error: any) {
        message.error(error.message);
    }
};
const folderChange = (galleryId: number) => {
    galleryChange(galleryId);
    galleryStore.page = 1;
    galleryStore.topGalleryId = galleryId;
};
const pageChange = (curPage: number) => {
    galleryChange(galleryStore.galleryId, curPage);
};
// 加载相册，仅改变图片选择区域
const galleryChange = async (id: number, pageId: number = 1) => {
    loading.value = true;
    galleryStore.page = pageId;
    try {
        const result = await getGalleryVideoInfoList({ id, page: pageId, sortOrder: galleryStore.sortOrder });
        uploadPicList.value = [];
        galleryPicList.value = result.galleryVideoInfoPage.records;
        childGalleryList.value = result.childGalleryList;
        picTotal.value = result.galleryVideoInfoPage.total;
        galleryStore.galleryId = id;
        galleryInfo.value = result.galleryVideo;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

const changeSort = (value: any) => {
    galleryStore.sortOrder = value;
    galleryChange(galleryStore.galleryId);
};
//  编辑相册
const editRecordCallback = (id: number, isMain: Boolean) => {
    if (isMain == true) {
        loadGallery(galleryStore.galleryId);
    } else {
        galleryChange(galleryStore.galleryId);
    }
};
// 添加相册
const addGalleryCallback = (parentId: number) => {
    // console.log(parentId);/
    if (parentId == 0) {
        loadGallery(galleryStore.galleryId);
    } else {
        galleryChange(galleryStore.galleryId);
    }
};
// 删除图片
const delPic = async (picId: number) => {
    try {
        const result = await delVideoInfoField({ id: picId });
        message.success("操作成功");
        galleryStore.topGalleryId = 0;
        galleryStore.galleryId = 0;
        loadGallery(galleryStore.galleryId);
    } catch (error: any) {
        message.error(error.message);
    }
};

// 删除相册
const delGallery = async (galleryId: number, key: number) => {
    try {
        const result = await delGalleryVideoInfo({ id: galleryId });
        message.success("操作成功");
        childGalleryList.value.splice(<any>key, 1);
        if (galleryStore.galleryId == galleryId) {
            galleryStore.topGalleryId = 0;
            galleryStore.galleryId = 0;
        }
        loadGallery(galleryStore.galleryId);
    } catch (error: any) {
        message.error(error.message);
    }
};

// 删除根相册
const delRootGallery = (galleryId: number, key: number) => {
    Modal.confirm({
        title: "您确认要删除所选相册吗？",
        okType: "danger",
        onOk() {
            delGallery(galleryId, key);
            loadTopGallery();
        }
    });
};
// 父组件回调
const emit = defineEmits(["submitCallback", "okType"]);
emit("okType", false);
// 选择图片
const selectPic = (pic: any, key: number) => {
    let selected = false; //当前图片在不在选择里
    if (selectedPics.value.length > 0) {
        for (let idx in selectedPics.value) {
            if (selectedPics.value[idx]["id"] == pic.id) {
                picList.value[key]["selected"] = false;
                selectedPics.value.splice(<any>idx, 1);
                selected = true;
            }
        }
    }
    // 如果是新钩选
    if (selected == false) {
        // 如果是单选，清除所有选项项
        if (isMultiple.value == false) {
            selectedPics.value = [];
            for (let idx in picList.value) {
                picList.value[idx]["selected"] = false;
            }
        }
        picList.value[key]["selected"] = true;
        selectedPics.value.push({
            id: pic.id,
            videoId: pic.id,
            videoCover: pic.videoCover,
            videoUrl: pic.videoUrl,
            videoName: pic.videoName,
            format: pic.format
        });
    }
    // 确认按钮状态，false为disabled
    emit("okType", selectedPics.value.length > 0 ? true : false);
};
// 弹窗回调
const onFormSubmit = () => {
    // 弹窗确认按钮提交
    emit("submitCallback", selectedPics.value);
};

defineExpose({
    onFormSubmit
});
</script>
<style lang="less" scoped>
@import "../gallery.less";
.duration {
    color: #fff;
    margin-left: 5px;
}
.video-item-box {
    background-color: #eee;
}
.gallery-list-ul {
    gap: 10px;
    .gallery-video-item {
        margin-right: 0 !important;
        margin-bottom: 5px !important;
        .desc{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
