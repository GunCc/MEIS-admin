<template>
    <div>
        <PageWrapper class="px-5 w-full">
            <div class="w-full"></div>
            <el-row :gutter="20" class="w-full">
                <el-col
                    :span="6"
                    v-for="item in analysisList"
                    :key="item.title"
                >
                    <div
                        :class="`h-30 rounded bg-gradient-to-r py-5 px-7 mt-5 ${item.class} flex flex-col justify-between`"
                    >
                        <div class="text-white text-lg font-weight-bold">
                            {{ item.title }}
                        </div>
                        <div
                            class="text-white text-2xl text-right font-weight-bold"
                        >
                            3 / 12
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="rounded bg-white dark:bg-gray-900 mt-5">
                        <el-calendar ref="calendar">
                            <template #header="{ date }">
                                <span>Custom header content</span>
                                <span>{{ date }}</span>
                                <el-button-group>
                                    <el-button
                                        size="small"
                                        @click="selectDate('prev-year')"
                                    >
                                        Previous Year
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('prev-month')"
                                    >
                                        Previous Month
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('today')"
                                        >Today</el-button
                                    >
                                    <el-button
                                        size="small"
                                        @click="selectDate('next-month')"
                                    >
                                        Next Month
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('next-year')"
                                    >
                                        Next Year
                                    </el-button>
                                </el-button-group>
                            </template>
                        </el-calendar>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="rounded bg-white dark:bg-gray-900 mt-5">
                        <el-calendar ref="calendar">
                            <template #header="{ date }">
                                <span>Custom header content</span>
                                <span>{{ date }}</span>
                                <el-button-group>
                                    <el-button
                                        size="small"
                                        @click="selectDate('prev-year')"
                                    >
                                        Previous Year
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('prev-month')"
                                    >
                                        Previous Month
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('today')"
                                        >Today</el-button
                                    >
                                    <el-button
                                        size="small"
                                        @click="selectDate('next-month')"
                                    >
                                        Next Month
                                    </el-button>
                                    <el-button
                                        size="small"
                                        @click="selectDate('next-year')"
                                    >
                                        Next Year
                                    </el-button>
                                </el-button-group>
                            </template>
                        </el-calendar>
                    </div>
                </el-col>
            </el-row>
        </PageWrapper>
    </div>
</template>
<script setup lang="ts">
import { PageWrapper } from "@c/PageWrapper/index"
import { CalendarDateType, CalendarInstance } from "element-plus"
const analysisList = reactive([
    {
        title: "使用人数",
        class: "from-green-500 to-blue-500 dark:from-green-300 dark:to-blue-300",
    },
    {
        title: "在线班级",
        class: "from-blue-500 to-pink-500 dark:from-blue-300 dark:to-pink-300",
    },
    {
        title: "任务总数",
        class: "from-pink-500 to-orange-500 dark:from-pink-300 dark:to-orange-300",
    },
    {
        title: "今日任务完成数量",
        class: "from-orange-500 to-yellow-500 dark:from-orange-300 dark:to-yellow-300",
    },
    {
        title: "使用人数",
        class: "from-green-500 to-blue-500 dark:from-green-300 dark:to-blue-300",
    },
    {
        title: "在线班级",
        class: "from-blue-500 to-pink-500 dark:from-blue-300 dark:to-pink-300",
    },
    {
        title: "任务总数",
        class: "from-pink-500 to-orange-500 dark:from-pink-300 dark:to-orange-300",
    },
    {
        title: "今日任务完成数量",
        class: "from-orange-500 to-yellow-500 dark:from-orange-300 dark:to-yellow-300",
    },
])
const calendar = ref<CalendarInstance>()
const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return
    calendar.value.selectDate(val)
}
</script>
<style lang="less" scoped></style>
