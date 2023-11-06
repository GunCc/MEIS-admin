import { FormItemSchemas } from "@/components/Form/src/types/form"
import { propTypes } from "@/utils/propTypes"
import { PropType } from "vue"
import { ColEx } from "./types"
export const basicProps = {
    schemas: {
        type: Array as PropType<FormItemSchemas[]>,
        default: () => [],
    },
    showAction: propTypes.bool.def(true),
    submitOnReset: propTypes.bool.def(true),
    validateOnSubmit: propTypes.bool.def(true),

    actionColOptions: {
        type: Object as PropType<Partial<ColEx>>,
    },
}
