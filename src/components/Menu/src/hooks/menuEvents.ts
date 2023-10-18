interface useMenuEventsContext {
    emit: EmitType
}

export function useMenuEvents({ emit }: useMenuEventsContext) {
    const handleOpen = (key: string, keyPath: string[]) => {
        emit("menuHandleOpen", key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
        emit("menuHandleClose", key, keyPath)
    }
    const handleSelect = (
        index: number,
        indexPath: string,
        item: Recordable,
        routeResult: boolean
    ) => {
        emit("menuHandleSelect", index, indexPath, item, routeResult)
    }
    return {
        handleOpen,
        handleClose,
        handleSelect,
    }
}
