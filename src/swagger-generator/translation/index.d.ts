export interface ParamsBaidu {
    from: string;
    to: string;
    trans_result: Array<{
        dst: string;
        src: string;
    }>;
    error_code: number;
}
export interface ParamsZhiyi {
    success: boolean;
    code: number;
    message: string;
    data: {
        entityTag: string;
        field: string;
        lang: string;
        src: Array<string>;
        tgt: {
            [key: string]: { status: string; tgt: string };
        };
    };
}
