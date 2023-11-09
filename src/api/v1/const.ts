import { BaseListRequest } from "@/api/model/commen/request"
// 获取不分页列表
export const ALL_LIST_INFO: Omit<BaseListRequest, "keyword"> = {
    pagesize: 999,
    page: 1,
}
