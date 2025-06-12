<template>
    <div class="product-container">
        <div class="anchor">
            <el-anchor :container="containerRef" :offset="10" direction="horizontal" @click="handleClick" @change="onChange">
                <div class="tab-row">
                    <el-anchor-link
                        v-for="(item, index) in tabList"
                        :key="item.id"
                        :href="'#' + item.id"
                        :class="{ active: partTab === '' && index === 0 ? true : partTab === '#' + item.id }"
                    >
                        <template #default>
                            <div class="item" :class="{ active: partTab === '' && index === 0 ? true : partTab === '#' + item.id }">
                                {{ item.title }}
                            </div>
                        </template>
                    </el-anchor-link>
                </div>
            </el-anchor>
        </div>
        <div class="form-container" ref="containerRef">
            <el-form v-if="!loading" ref="formRef" :model="formState" label-width="100px" name="form_in_modal">
                <div class="form-warp" id="part1">
                    <div class="title">
                        <p class="xian"></p>
                        基本信息
                    </div>
                    <el-form-item :rules="[{ required: true }]" label="商品类型" prop="productType">
                        <div>
                            <div class="extra mb10" style="margin-top: 3px">不同商品类型可编辑的字段内容不同，商品类型一旦发布后将不可更改</div>
                            <RadioType v-model:modelValue="formState.productType" :radioList="radioList" :disabled="action == 'detail'"></RadioType>
                            <div v-if="formState.productType != 1" class="extra mt10">该类型商品同样需要客户填写收货地址</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="商品图片" prop="imgList" :rules="[{ required: true, validator: validateImg }]">
                        <FormAddGallery v-if="!loading" v-model:photos="formState.imgList" :isMultiple="true" :disabled="examine == 1"> </FormAddGallery>
                        <div class="extra">您可以通过拖拽来调整相册图片顺序，第一张图将作为商品主图展示</div>
                    </el-form-item>
                    <el-form-item label="商品视频" prop="productVideoInfo">
                        <FormAddGalleryVideo v-if="!loading" v-model:video="formState.productVideoInfo" :disabled="examine == 1"> </FormAddGalleryVideo>
                        <div class="extra">如有商品视频则商品视频作为商品主图展示</div>
                    </el-form-item>
                    <el-form-item
                        label="电子卡券分组"
                        class="inner-item"
                        prop="cardGroupId"
                        v-if="formState.productType == 3"
                        :rules="[{ required: true, validator: validateCardGroup }]"
                    >
                        <div class="flex flex-justify-between">
                            <el-select v-model="formState.cardGroupId" placeholder="请选择" :disabled="examine == 1">
                                <el-option v-for="item in formState.eCardList" :key="item.groupId" :label="item.groupName" :value="item.groupId" />
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item :rules="[{ required: true, validator: validateName }]" label="商品名称" prop="productName" class="inner-item">
                        <BusinessData
                            v-model:modelValue="formState.productName"
                            :disabled="examine == 1"
                            placeholder="请输入商品名称"
                            :dataType="2"
                            :dataId="id"
                            :maxlength="100"
                        ></BusinessData>
                    </el-form-item>
                    <el-form-item label="商品品牌" prop="brandId" class="inner-item">
                        <SelectBrand v-if="!loading" v-model:brandId="formState.brandId" :disabled="examine == 1" style="width: 190px;"></SelectBrand>
                    </el-form-item>
                    <el-form-item
                        :rules="[{ required: true, message: '请选择商品类目!', validator: validateCate }]"
                        label="商品类目"
                        prop="categoryId"
                        class="inner-item"
                    >
                        <div class="flex flex-justify-between">
                            <SelectCategory
                                ref="selectCategory"
                                v-if="!loading"
                                v-model:categoryId="formState.categoryId"
                                :multiple="false"
                                :disabled="examine == 1"
                                style="width: 100%"
                            ></SelectCategory>
                            <div class="con-btn" v-if="examine != 1">
                                <DialogForm
                                    :params="{ act: 'add', parentId: 0 }"
                                    isDrawer
                                    path="product/category/Info"
                                    title="添加分类"
                                    width="600px"
                                    @okCallback="refreshCategory"
                                >
                                    <el-button link type="primary">新建</el-button>
                                </DialogForm>
                                <p class="ml10 mr10" style="margin-bottom: 3px">|</p>
                                <el-button link type="primary" :loading="configLoading" @click="refreshCategory">刷新</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="adminType == 'shop'" label="店铺分类" prop="shopCategoryId" class="inner-item">
                        <SelectShopProductCategory
                            v-model:categoryId="formState.shopCategoryId"
                            :disabled="examine == 1"
                        ></SelectShopProductCategory>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="decimal" class="inner-item">
                        <TigInput width="190px" type="decimal" :decimalPlaces="3" v-model="formState.productWeight" class="InputBox" :disabled="examine == 1" placeholder="请输入">
                            <template #append>Kg</template>
                        </TigInput>
                    </el-form-item>
                    <el-form-item label="商品条码" prop="productTsn" class="inner-item">
                        <div>
                            <TigInput classType="tig-form-input" v-model="formState.productTsn" :disabled="examine == 1" />
                            <div class="extra">用于快速识商品所标记的编码，比如：69开头的13位标准码</div>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item label="商品编码" prop="snType">
                        <div>
                            <div>
                                <el-radio-group v-model="formState.snType">
                                    <el-radio :value="1">系统自动生成</el-radio>
                                    <el-radio :value="2">手动输入</el-radio>
                                </el-radio-group>
                                <el-form-item v-if="formState.snType === 2" label="" prop="productSn" :rules="[{ required: true, message: '请输入商品编码' }]">
                                    <el-input placeholder="请输入商品编码" v-model="formState.productSn" :disabled="examine == 1" />
                                </el-form-item>
                            </div>
                            <div class="extra">商品编码是该商品在系统里唯一ID，用于识商品的唯一编码</div>
                        </div>
                    </el-form-item> -->
                    <el-form-item label="商品编码" prop="productSn" class="inner-item">
                        <div>
                            <TigInput classType="tig-form-input" v-model="formState.productSn" :disabled="examine == 1" />
                            <div class="extra">如果您不输入商品编码，系统将自动生成一个唯一的编码</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="搜索关键词" prop="keywords" class="inner-item">
                        <div class="keywords">
                            <TigInput
                                classType="tig-form-input"
                                :disabled="examine == 1"
                                v-model="formState.keywords"
                                class="InputBox"
                                placeholder="例如：牙刷 自动 清洁"
                            />
                            <el-button :disabled="examine == 1" @click="onGetParticiple">更新关键词</el-button>
                        </div>
                        <div class="extra">用空格分隔，为空时会自动根据商品名称分词</div>
                    </el-form-item>
                    <el-form-item extra="" label="商品描述" prop="productBrief" class="inner-item">
                        <div>
                            <TigInput
                                classType="tig-form-input"
                                v-model="formState.productBrief"
                                :rows="2"
                                type="textarea"
                                :disabled="examine == 1"
                                placeholder="例如：顺丰快递 又快又好"
                            ></TigInput>
                            <div class="extra">该描述一般会高亮出现在商品名称后面</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="productStatus" class="inner-item">
                        <el-radio-group style="width: 100%" v-model="formState.productStatus" :disabled="examine == 1">
                            <el-radio :value="1">上架</el-radio>
                            <el-radio :value="0">下架</el-radio>
                        </el-radio-group>
                        <div class="extra">上架则允许销售（未审核的商品无法手动上架）</div>
                    </el-form-item>
                </div>
                <div class="form-warp" id="part2">
                    <div class="title">
                        <p class="xian"></p>
                        价格及库存
                    </div>
                    <div>
                        <el-form-item
                            label="商品售价"
                            prop="productPrice"
                            :rules="[{ required: true, message: '商品售价不能为空', validator: validatePrice }]"
                            class="inner-item"
                        >
                            <PriceInput width="190px" v-model:modelValue="formState.productPrice" :disabled="examine == 1" placeholder="请输入商品售价"></PriceInput>
                        </el-form-item>
                        <el-form-item extra="不填则根据设置的比例自动计算" label="划线价" prop="marketPrice" class="inner-item">
                            <div>
                                <PriceInput width="190px" v-model:modelValue="formState.marketPrice" :disabled="examine == 1" placeholder="请输入商品划线价"></PriceInput>
                                <div class="extra">划线价格，不填则不显示</div>
                            </div>
                        </el-form-item>
                        <!-- <el-form-item label="成本价" prop="marketPrice">
                            <el-input type="number" v-model="formState.marketPrice" :disabled="examine == 1" placeholder="请输入" />
                            <div class="extra">成本价未来会用于营销建议，利润分析等</div>
                        </el-form-item> -->
                    </div>
                    <!-- <ProductAttr
                        v-model:attrChanged="formState.attrChanged"
                        v-model:attrList="formState.attrList"
                        v-model:productList="formState.productList"
                        :attrTplList="attrTplList"
                        :disabled="examine == 1"
                    ></ProductAttr> -->
                    <Attr
                        v-if="!loading"
                        ref="attrForm"
                        v-model:attrChanged="formState.attrChanged"
                        v-model:attrList="formState.attrList"
                        v-model:productList="formState.productList"
                        :attrTplList="attrTplList"
                        :action="action"
                        :disabled="examine == 1"
                    ></Attr>
                    <el-form-item
                        v-if="!formState.productList || formState.productList.length == 0"
                        label="库存"
                        prop="productStock"
                        :rules="[{ required: true, message: '商品库存不能为空', validator: validateStock }]"
                        class="inner-item"
                    >
                        <TigInput
                            width="190px"
                            type="integer"
                            v-model="formState.productStock"
                            placeholder="请输入商品库存"
                            :disabled="examine == 1"
                        />
                        <!-- <div class="extra">
                                <el-checkbox v-model="formState.skuType" label="商品详情、购物车不显示剩余件数" />
                            </div> -->
                    </el-form-item>
                    <el-form-item label="限购数量" prop="limitNumber" class="inner-item">
                        <div>
                            <TigInput
                                width="190px"
                                type="integer"
                                v-model="formState.limitNumber"
                                description="请输入限购数量"
                                :disabled="examine == 1"
                            />
                            <div class="extra">商品限购数量，为0则不限制</div>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item label="库存扣减方式" prop="skuType">
                        <div>
                            <div>
                                <el-radio-group v-model="formState.skuType" :disabled="examine == 1">
                                    <el-radio :value="1">拍下减库存</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="extra">消费者提交订单，扣减库存数量，可能存在<span style="color: #eeab03">恶意占用库存</span>风险。</div>
                            <div>
                                <el-radio-group v-model="formState.skuType" :disabled="examine == 1">
                                    <el-radio :value="2">付款减库存</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="extra">买家支付成功扣减库存数量，可能存在超卖风险，需要人工手动进行退款。</div>
                        </div>
                    </el-form-item> -->
                    <!-- <el-form-item label="是否限购" prop="productQuota">
                        <div>
                            <div>
                                <el-switch v-model="formState.productQuota" :disabled="examine == 1" />
                            </div>
                            <div class="extra">启用限购后，购买商品时，会对该商品购买量做限制判断。</div>
                        </div>
                    </el-form-item> -->
                    <!-- <el-form-item label="限购类型" prop="skuType" v-if="formState.productQuota">
                        <div>
                            <div class="mb10">
                                <el-radio-group v-model="formState.skuType" :disabled="examine == 1">
                                    <el-radio :value="1">
                                        单次限购&nbsp;&nbsp;&nbsp;&nbsp;
                                        <el-input v-model="formState.productStock" placeholder="请输入限购数量" :disabled="examine == 1">
                                            <template #append>件</template>
                                        </el-input>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <div>
                                <el-radio-group v-model="formState.skuType" :disabled="examine == 1">
                                    <el-radio :value="2">
                                        单人限购&nbsp;&nbsp;&nbsp;&nbsp;
                                        <el-input v-model="formState.productStock" placeholder="请输入限购数量" :disabled="examine == 1">
                                            <template #append>件</template>
                                        </el-input>
                                    </el-radio>
                                </el-radio-group>
                            </div>
                            <div class="extra">单次限购是针对于每次下单不能超过限购数量，单人限购是针对于客户购买这个商品的总数不能超过限购数量。</div>
                        </div>
                    </el-form-item> -->
                </div>
                <div class="form-warp" id="part3">
                    <div class="title">
                        <p class="xian"></p>
                        物流及配送
                    </div>
                    <!-- <el-form-item label="是否包邮" prop="freeShipping" v-if="formState.productType == 1">
                        <el-radio-group style="width: 100%" v-model="formState.freeShipping" :disabled="examine == 1">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                        </el-radio-group>
                        <div class="extra">勾选“是”表示此商品不会产生运费花销，勾选“否”表示按照正常运费计算。</div>
                    </el-form-item> -->
                    <el-form-item
                        label="配送方式"
                        prop="noShipping"
                        :rules="[{ required: true, message: '请选择配送方式!' }]"
                        v-if="formState.productType != 1"
                    >
                        <el-radio-group style="width: 100%" v-model="formState.noShipping" :disabled="examine == 1">
                            <el-radio :value="1">无需配送</el-radio>
                        </el-radio-group>
                        <el-radio-group
                            style="width: 100%"
                            v-model="formState.noShipping"
                            :disabled="examine == 1 || formState.productType != 1 || formState.noShipping == 1"
                        >
                            <el-radio :value="0">
                                <div class="flex flex-align-center">
                                    <div class="mr10">运费模板</div>
                                    <el-form-item label="" prop="shippingTplId">
                                        <div class="flex flex-justify-between">
                                            <el-select
                                                v-model="formState.shippingTplId"
                                                placeholder="请选择"
                                                style="width: 100%"
                                                :disabled="examine == 1 || formState.productType != 1 || formState.noShipping == 1"
                                            >
                                                <el-option
                                                    v-for="item in formState.shippingTplList"
                                                    :key="item.shippingTplId"
                                                    :label="item.shippingTplName"
                                                    :value="item.shippingTplId"
                                                />
                                            </el-select>
                                            <div class="con-btn" v-if="examine != 1">
                                                <DialogForm
                                                    :params="{ act: 'add' }"
                                                    isDrawer
                                                    path="setting/shippingTpl/Info"
                                                    title="添加运费模板"
                                                    width="900px"
                                                    @okCallback="fetchProductConfig"
                                                >
                                                    <el-button link type="primary">新建</el-button>
                                                </DialogForm>
                                                <p class="ml10 mr10" style="margin-bottom: 3px">|</p>
                                                <el-button link type="primary" :loading="configLoading" @click="fetchProductConfig">刷新</el-button>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        v-if="formState.productType == 1"
                        label="运费模板"
                        prop="shippingTplId"
                        :rules="[{ required: true, validator: validateShippingTpl }]"
                    >
                        <div>
                            <div class="flex flex-justify-between">
                                <el-select
                                    v-model="formState.shippingTplId"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    :disabled="examine == 1 || formState.productType != 1 || formState.noShipping == 1 || formState.shopId > 0"
                                >
                                    <el-option
                                        v-for="item in formState.shippingTplList"
                                        :key="item.shippingTplId"
                                        :label="item.shippingTplName"
                                        :value="item.shippingTplId"
                                    />
                                </el-select>
                                <div class="con-btn" v-if="examine != 1">
                                    <DialogForm
                                        :params="{ act: 'add' }"
                                        isDrawer
                                        path="setting/shippingTpl/Info"
                                        title="添加运费模板"
                                        width="900px"
                                        @okCallback="fetchProductConfig"
                                    >
                                        <el-button link type="primary">新建</el-button>
                                    </DialogForm>
                                    <p class="ml10 mr10" style="margin-bottom: 3px">|</p>
                                    <el-button link type="primary" :loading="configLoading" @click="fetchProductConfig">刷新</el-button>
                                </div>
                            </div>
                            <div class="extra">可选择自定义的运费模板，不选择默认会指定默认运费模板。</div>
                        </div>
                    </el-form-item>
                </div>
                <div class="form-warp" id="part4">
                    <div class="title">
                        <p class="xian"></p>
                        商品详情
                    </div>
                    <ProductDesc :productType="formState.productType" v-if="formState.productType == 4" label="付费内容详情" v-model:descArr="formState.paidContent" :disabled="examine == 1"></ProductDesc>
                    <ProductDesc :label="formState.productType == 4 ? '普通商品详情' : '商品详情'" v-model:descArr="formState.productDescArr" :disabled="examine == 1"></ProductDesc>
                    <el-form-item
                        v-if="formState.productType == 2"
                        label="虚拟商品信息"
                        prop="virtualSample"
                        :rules="[{ required: true, message: '虚拟商品信息不能为空!' }]"
                    >
                        <Editor v-model:html="formState.virtualSample" height="350px"></Editor>
                        <div class="extra">此处填写内容，将在订单详情中展示</div>
                    </el-form-item>
                    <!-- <el-form-item
                        v-if="formState.productType == 4"
                        label="付费内容描述"
                        prop="paidContent"
                        :rules="[{ required: true, message: '付费内容信息不能为空!' }]"
                    >
                        <Editor v-model:html="formState.paidContent" height="350px"></Editor>
                        <div class="extra">此处填写内容，将在商品付费后展示</div>
                    </el-form-item> -->
                    
                </div>
                <div class="form-warp" id="part5">
                    <div class="title">
                        <p class="xian"></p>
                        高级信息
                    </div>
                    <el-form-item label="加入推荐">
                        <Checkbox v-model="formState.isBest" :disabled="examine == 1">
                            <template #default> 精品</template>
                        </Checkbox>
                        <Checkbox v-model="formState.isNew" :disabled="examine == 1">
                            <template #default> 新品</template>
                        </Checkbox>
                        <Checkbox v-model="formState.isHot" :disabled="examine == 1">
                            <template #default> 热销</template>
                        </Checkbox>
                    </el-form-item>
                    <el-form-item label="供应商" prop="suppliersId" class="inner-item">
                        <el-select v-model="formState.suppliersId" placeholder="请选择" :disabled="examine == 1">
                            <el-option label="请选择" :value="0"></el-option>
                            <el-option v-for="item in formState.suppliersList" :key="item.suppliersId" :label="item.suppliersName" :value="item.suppliersId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务说明" prop="productServiceIds">
                        <Checkbox v-model="item.check" v-for="(item, index) in formState.serviceList" :key="index" :disabled="examine == 1">
                            <template #default>{{ item["productServiceName"] }}</template>
                        </Checkbox>
                    </el-form-item>
                    <!-- 少了售后服务 -->
                    <el-form-item label="货到付款" prop="isSupportCod">
                        <el-radio-group style="width: 100%" v-model="formState.isSupportCod" :disabled="examine == 1">
                            <el-radio :value="1">是</el-radio>
                            <el-radio :value="0">否</el-radio>
                        </el-radio-group>
                        <div class="extra">勾选“是”表示该商品可以使用货到付款</div>
                    </el-form-item>
                    <!-- 少了开售时间 -->
                    <!-- 少了定时下架 -->
                    <!-- 少了起售数量 -->
                    <el-form-item label="显示销量" prop="virtualSales" class="inner-item">
                        <div>
                            <TigInput
                                width="190px"
                                type="integer"
                                v-model="formState.virtualSales"
                                class="InputBox"
                                :disabled="examine == 1"
                            ></TigInput>
                            <div class="extra">显示销量会随下单而增加，但不是真实销售数据</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="相关商品" prop="productRelated">
                        <SelectProduct :max="10" v-if="!loading" v-model:ids="formState.productRelated" :disabled="examine == 1"></SelectProduct>
                        <div class="extra">最多添加10个商品，仅用于在商品详情页展示</div>
                    </el-form-item>
                    <el-form-item label="关联文章" prop="productArticleList">
                        <SelectArticle :max="10" v-if="!loading" v-model:modelValue="formState.productArticleList" :disabled="examine == 1"></SelectArticle>
                        <div class="extra">最多添加10篇文章</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { FormAddGallery, FormAddGalleryVideo } from "@/components/gallery";
import { ProductFormState, ServiceList } from "@/types/product/product.d";
import { getParticiple, getProduct, getProductConfig, updateProduct, AuditAgainProduct } from "@/api/product/product";
import { Checkbox, RadioType } from "@/components/radio";
import { SelectArticle, SelectBrand, SelectCategory, SelectProduct, SelectShopProductCategory } from "@/components/select";
import ProductDesc from "@/views/product/product/src/ProductDesc.vue";
import PriceInput from "@/views/product/product/src/PriceInput.vue";
import Attr from "@/views/product/product/src/Attr.vue";
import { useConfigStore } from "@/store/config";
import { DialogForm } from "@/components/dialog";
import BusinessData from "@/components/multilingual/BusinessData.vue";
import { isPro } from "@/utils/version";
import { Editor } from "@/components/editor/index";
const config = useConfigStore().config;
const showDesc = ref(1);
const emit = defineEmits(["submitCallback", "update:confirmLoading", "close", "closeConfirm"]);
const props = defineProps({
    id: {
        type: Number,
        default: 0
    },
    act: {
        type: String,
        default: ""
    },
    examine: {
        type: Number,
        default: 0
    },
    isDialog: Boolean
});
const tabList = [
    {
        title: "基本信息",
        id: "part1"
    },
    {
        title: "价格及库存",
        id: "part2"
    },
    {
        title: "物流及配送",
        id: "part3"
    },
    {
        title: "商品详情",
        id: "part4"
    },
    {
        title: "高级信息",
        id: "part5"
    }
];

const containerRef = ref<HTMLElement | null>(null);
const partTab = ref("");
const handleClick = (e: MouseEvent) => {
    e.preventDefault();
};
const onChange = (e: string) => {
    partTab.value = e;
};
const adminType = ref(localStorage.getItem("adminType"));
const loading = ref<boolean>(true);
const query = useRouter().currentRoute.value.query;
const action = ref<string>(props.isDialog ? props.act : String(query.act));
const id = ref<number>(props.isDialog ? props.id : Number(query.id));
const operation = action.value === "add" ? "create" : action.value === "copy" ? "copy" : "update";
const formRef = shallowRef();
const formState = ref<ProductFormState>({
    snType: 1,
    productType: 1,
    freeShipping: 0,
    shopCategoryId: 0,
    productStatus: 1,
    giveIntegral: -1,
    rankIntegral: -1,
    integral: 0,
    isSupportCod: 0,
    productVideoInfo: [],
    productDescArr: [],
    productRelated: [],
    serviceList: [],
    eCardList: [],
    productList: [],
    limitNumber: 0,
    virtualSample: "",
    paidContent: [],
    noShipping: 0,
    attrList: {
        normal: [],
        spe: [],
        extra: []
    }
});
watch(formState.value, (val) => {
    if (val.productType != 1) {
        formState.value.noShipping = 1;
    } else {
        formState.value.noShipping = 0;
    }
});
const radioList = ref<any[]>([]);
onMounted(async () => {
    await fetchProductConfig(false);
    if (isPro()) {
        radioList.value = [
            { key: 1, title: "普通商品", desc: "物流配送" },
            // {
            //     key: 3,
            //     title: "卡密商品",
            //     tips: "可以在菜单中【营销>电子卡券组】创建卡券组，然后在【查看卡列表】添加单个卡密或通过下载【批量导入模板文件】填好卡密后在通过批量导入电子卡券按钮上传该文件批量导入。",
            //     desc: "无需物流"
            // },
            // {
            //     key: 2,
            //     title: "虚拟商品",
            //     tips: "网盘链接、视频链接，在添加商品添加虚拟商品。用户购买后将在订单详情直接展示。",
            //     desc: "无需物流"
            // },
            // {
            //     key: 4,
            //     title: "付费内容",
            //     tips: "软件授权、在线课程等。通过简单的操作，即可将这些商品添加到您的商店中，为客户提供更丰富的选择。立即体验，享受便捷的付费内容管理服务。",
            //     desc: "无需物流"
            // }
        ];
    } else {
        radioList.value = [{ key: 1, title: "普通商品" }];
    }
    if (action.value === "detail" || action.value === "copy" || action.value === "again") {
        // 获取详情数据
        await fetchProduct();
    } else {
        loading.value = false;
    }
    setTimeout(() => {
        emit("closeConfirm", true);
    }, 10000);
});
// 滚动到指定的表单项
const scrollToTab = (tabId: string, position?: any) => {
    partTab.value = tabId;
    position = position || "start";
    const tabElement = document.querySelector(tabId);
    if (tabElement) {
        tabElement.scrollIntoView({ behavior: "smooth", block: position });
    }
};
// 属性模板
const attrTplList = ref<Object[]>([]);
// 会员名称
const validateName = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("商品名称不能为空"));
        nextTick(() => {
            scrollToTab("#part1");
        });
        return;
    } else {
        callback();
    }
};
const validateImg = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("请选择商品图片"));
        nextTick(() => {
            scrollToTab("#part1");
        });
        return;
    } else {
        callback();
    }
};
const validateCate = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("请选择商品类目"));
        nextTick(() => {
            scrollToTab("#part1");
        });
        return;
    } else {
        callback();
    }
};
const validatePrice = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("商品售价不能为空"));
        nextTick(() => {
            scrollToTab("#part2");
        });
        return;
    } else {
        callback();
    }
};
const validateStock = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("商品库存不能为空"));
        nextTick(() => {
            scrollToTab("#part2", "end");
        });
        return;
    } else {
        callback();
    }
};
const validateCardGroup = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("请选择电子卡券组"));
        nextTick(() => {
            scrollToTab("#part1");
        });
        return;
    } else {
        callback();
    }
};
const validateShippingTpl = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error("请选择运费模板"));
        nextTick(() => {
            scrollToTab("#part3");
        });
        return;
    } else {
        callback();
    }
};

const fetchProduct = async () => {
    try {
        const result = await getProduct("detail", { id: id.value });
        if (result.productRelated == null) {
            result.productRelated = [];
        }
        formState.value.serviceList = formState.value.serviceList.map((item: ServiceList) => {
            return {
                ...item,
                check: result.productServiceIds?.includes(item.productServiceId) ? 1 : 0
            };
        });
        Object.assign(formState.value, result, result);
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
    }
};
const configLoading = ref(false);
const selectCategory = ref<any>();
const refreshCategory = async () => {
    configLoading.value = true;
    try {
        selectCategory.value.loaded = false;
        await selectCategory.value.loadCategory();
    } catch (error: any) {
        message.error(error.message);
    } finally {
        setTimeout(() => {
            configLoading.value = false;
        }, 200);
    }
};
const fetchProductConfig = async (isMsg: boolean = true) => {
    configLoading.value = true;
    try {
        const result = await getProductConfig();
        attrTplList.value = result.attrTplList;
        formState.value.serviceList = result.serviceList;
        formState.value.serviceList = result.serviceList?.map((item: ServiceList) => {
            return {
                ...item,
                check: result.item.productServiceIds?.includes(item.productServiceId) ? 1 : 0
            };
        });
        formState.value.suppliersList = result.suppliersList;
        formState.value.shippingTplList = result.shippingTplList;
        formState.value.eCardList = result.eCardList;
    } catch (error: any) {
        message.error(error.message);
        emit("close");
    } finally {
        loading.value = false;
        setTimeout(() => {
            configLoading.value = false;
        }, 200);
    }
};
function validateSkus(skus: any) {
    for (let i = 0; i < skus.length; i++) {
        const sku = skus[i];
        if (
            !sku.attrValues ||
            sku.attrValues.length === 0 ||
            sku.attrValues.some((value: string) => value === "") ||
            sku.skuStock === null ||
            sku.skuStock === undefined
        ) {
            console.error("请填写完整的规格信息");
            return false;
        }
    }
    return true;
}
const attrForm = ref<any>();
// 表单通过验证后提交
const onSubmit = async () => {
    await formRef.value.validate();
    if (formState.value.productType == 2 && (formState.value.virtualSample == "<p><br></p>" || formState.value.virtualSample == "")) {
        message.error("虚拟商品信息不能为空!");
        nextTick(() => {
            scrollToTab("#part4");
        });
        return;
    }
    if (formState.value.productType == 4 && formState.value.paidContent.length == 0) {
        message.error("付费内容信息不能为空!");
        nextTick(() => {
            scrollToTab("#part4");
        });
        return;
    }
    if (!validateSkus(formState.value.productList)) {
        message.error("请将商品规格的信息填写完整!");
        attrForm.value.skuErrorText = "请将商品规格的信息填写完整";
        nextTick(() => {
            scrollToTab("#part2", "end");
        });
    } else {
        attrForm.value.skuErrorText = "";
    }
    await attrForm.value.validateProductSku();
    try {
        emit("update:confirmLoading", true);
        formState.value.productServiceIds = formState.value.serviceList.filter((item) => item.check === 1).map((item) => item.productServiceId);
        const result = await updateProduct(operation, { ...formState.value });
        if (props.act === "again") {
            await AuditAgainProduct({ id: id.value });
        }
        emit("submitCallback", result);
        message.success(result as any);
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

const onGetParticiple = async () => {
    try {
        const result = await getParticiple({ productName: formState.value.productName });
        formState.value.keywords = result;
    } catch (error: any) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }
};

defineExpose({ onFormSubmit });
</script>
<style lang="less" scoped>
.product-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    :deep(.el-anchor__marker) {
        display: none !important;
        opacity: 0 !important;
        z-index: -10 !important;
    }
    .inner-item {
        :deep(.el-textarea) {
            width: 450px;
        }
        :deep(.el-select) {
            width: 450px;
        }
    }
    .anchor {
        padding-bottom: 10px;
        background-color: #fff;
        .tab-row {
            display: flex;
            width: 100%;
            height: 38px;
            box-sizing: border-box;

            :deep(.el-anchor__item) {
                height: 100%;
                flex: 1;
                background-color: var(--tig-item-active-bg);
                color: #314f73;
                margin-right: -10px;
                padding-left: 10px;
                clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%);

                &:first-child {
                    padding-left: 0;
                    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%);
                }

                &:last-child {
                    margin-right: 0 !important;
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 15px 50%);
                }
            }
            :deep(.el-anchor__link) {
                height: 100%;
                width: 100%;
            }

            .item {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            }

            .active {
                color: #fff;
                background-color: var(--tig-primary);
            }
        }
    }

    .form-container {
        flex: 1;
        overflow-y: auto;
        .title {
            background-color: #f5f7fa;
            font-size: 14px;
            font-weight: bold;
            padding: 5px 10px;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .xian {
                width: 3px;
                height: 14px;
                background-color: var(--tig-primary);
                margin-right: 5px;
            }
        }
        .form-warp {
            margin-top: 10px;
        }
    }
    /* 隐藏滚动条 */
    .form-container::-webkit-scrollbar {
        display: none; /* 对于 WebKit 浏览器（如 Chrome 和 Safari） */
    }
}
.con-btn {
    display: flex;
    align-content: center;
    padding-left: 10px;
    span {
        color: #999;
    }
    a {
        display: block;
        word-break: keep-all;
        padding: 0 5px;
    }
}
.rank {
    display: flex;
    width: 100%;
    flex-wrap: wrap; /* 允许项目换行 */
    justify-content: flex-start; /* 项目在主轴上的对齐方式 */
}
.keywords {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 8px;
}

@media (max-width: 768px) {
    .inner-item {
        :deep(.el-textarea) {
            width: 100% !important;
        }
        :deep(.el-select) {
            min-width: 0 !important;
            width: 100% !important; /* 如果需要宽度100% */
        }
    }
}
</style>
