export interface AxiosResult<T> {
    isOk: boolean;
    data?: T;
    errorMessage?: string;
    statusCode: number;
}