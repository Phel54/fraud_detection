import { Response } from 'express';

class apiResponse {
    async successResponse(res: Response, msg: string) {
        const data = {
            status: 1,
            client_message: msg,
        }
        return res.status(200).json(data)
    }
    async successResponseWithData(res: Response, message: string, data: Object) {
        const resData = {
            status: 1,
            success: true,
            client_message: message,
            data: data,
        }
        return res.status(200).json(resData)
    }

    async errorResponse(res: Response, msg: string, statusCode = 500) {
        const data = {
            status: 0,
            server_message: msg,
        }
        return res.status(statusCode).json(data)
    }

    async notFoundResponse(res: Response, msg: string) {
        const data = {
            status: 0,
            client_message: msg,
        }
        return res.status(404).json(data)
    }

    async validationErrorWithData(res: Response, msg: string, data: Object) {
        const resData = {
            status: 0,
            server_message: msg,
            data: data,
        }
        return res.status(400).json(resData)
    }

    async validationErrorOnly(res: Response, msg: string) {
        let resData = {
            status: 0,
            success: false,
            error: msg,
        }
        return res.status(400).json(resData)
    }

    async unauthorizedResponse(res: Response, msg: string) {
        const data = {
            status: 0,
            client_message: msg,
        }
        return res.status(401).json(data)
    }

}

export default new apiResponse;