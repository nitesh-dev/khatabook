export interface AxiosResult<T> {
    isOk: boolean;
    data: T | null;
    error: null | {
        message: string;
        error: string;
        statusCode: number;
    };
}