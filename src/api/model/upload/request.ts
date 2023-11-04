export interface FileEdit {
    id: number
    name: string
}

export interface ResourceType {
    id: number
    name: string
}

export interface FileBindType {
    files: number[]
    type_id: number
}
