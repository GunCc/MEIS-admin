import { isEqual } from "lodash"
import { DeepReadonly, UnwrapRef } from 'vue';

export function useFormItem<T extends Recordable, K extends keyof T, V = UnwrapRef<T[K]>>(
    props: T,
    key?: K,
    changeEvent?,
    emitData?: Ref<any[]>,
  ): [WritableComputedRef<V>, (val: V) => void, DeepReadonly<V>];

// 表单 items 中双向绑定
export function useFormItem<T extends Recordable>(
    props: T,
    key: keyof T = "value",
    changeEvent = "change",
    emitData?: Ref<any[]>
) {
    const instance = getCurrentInstance()

    const emit = instance?.emit

    const innerState = reactive({
        value: props[key],
    })

    // 默认值
    const defaultState = readonly(innerState)

    const setState = (val: UnwrapRef<T[keyof T]>): void => {
        innerState.value = val as T[keyof T]
    }

    watchEffect(() => {
        innerState.value = props[key]
    })

    const state: any = computed({
        get: () => {
            return innerState.value
        },
        set: value => {
            if (isEqual(value, defaultState.value)) return
            innerState.value = value as T[keyof T]
            emit?.(changeEvent, value, ...(toRaw(unref(emitData)) || []))
        },
    })

    return [state, setState, defaultState]
}
