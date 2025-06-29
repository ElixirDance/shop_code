<?php
//**---------------------------------------------------------------------+
//** 模型文件 -- 商品属性模板
//**---------------------------------------------------------------------+
//** 版权所有：江西佰商科技有限公司. 官网：https://www.tigshop.com
//**---------------------------------------------------------------------+
//** 作者：Tigshop团队，yq@tigshop.com
//**---------------------------------------------------------------------+
//** 提示：Tigshop商城系统为非免费商用系统，未经授权，严禁使用、修改、发布
//**---------------------------------------------------------------------+

namespace app\model\product;

use think\Model;

class ProductAttributesTpl extends Model
{
    protected $pk = 'tpl_id';
    protected $table = 'product_attributes_tpl';
    protected $json = ['tpl_data'];
    // 设置JSON数据返回数组
    protected $jsonAssoc = true;


    public function getTplDataAttr($value)
    {
        if (empty($value)) {
            return $value;
        }
        return camelCase($value);
    }

    public function setTplDataAttr($value)
    {
        if (empty($value)) {
            return $value;
        }
        return camelCase($value);
    }
}
