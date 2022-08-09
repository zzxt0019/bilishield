import { Setting } from '@/config/setting';
/**
 * 内部检查器配置 判断条件
 */
export interface Checker {
    innerSelector?: string  // 内部选择器 判断的目标
    setting?: Setting  // 数据配置
    always?: boolean  // 第1层判断 true表示有即选中, false进入下一层
    innerHTML?: boolean  // 第2层判断 true表示根据innerHTML判断, false进入下一层
    attribute?: string  // 第3层判断 attribute为节点属性的key, 表示根据这个属性的value判断
}