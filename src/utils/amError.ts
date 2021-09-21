export class AMError extends Error {
    httpStatusCode: number;
    data: any;
    constructor(httpStatusCode: number, errorCode: string, message: string, data?: any) {
        super();
        this.httpStatusCode = httpStatusCode;
        this.name = errorCode;
        this.message = message;
        this.data = data;
    }
}