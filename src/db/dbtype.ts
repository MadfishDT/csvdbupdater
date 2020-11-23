export interface iDBInfo {
    host?: string,
    user?: string,
    password?: string,
    database?: string,
}

export interface iCSVFileInfo {
    path?: string,
    keyField?: string,
    keyDBField?: string,
    keyDBTable?: string,
    row?: any[],
    updateField?: string,
    updateDBField?: string
}
