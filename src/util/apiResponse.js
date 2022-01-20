class apiResponse {
    async successResponse(res, msg) {
        const data = {
            status: 1,
            message: msg,
        }
        return res.status(200).json(data)
    }
    async successResponseWithData(res, message, data) {
        const resData = {
            status: 1,
            success: true,
            message: message,
            data: data,
        }
        return res.status(200).json(resData)
    }

    async errorResponse(res, msg, statusCode = 500) {
        const data = {
            status: 0,
            message: msg,
        }
        return res.status(statusCode).json(data)
    }

    async notFoundResponse(res, msg) {
        const data = {
            status: 0,
            message: msg,
        }
        return res.status(404).json(data)
    }

    async validationErrorWithData(res, msg, data) {
        const resData = {
            status: 0,
            message: msg,
            data: data,
        }
        return res.status(400).json(resData)
    }

    async validationErrorOnly(res, msg) {
        let resData = {
            status: 0,
            success: false,
            error: msg,
        }
        return res.status(400).json(resData)
    }

    async unauthorizedResponse(res, msg) {
        const data = {
            status: 0,
            message: msg,
        }
        return res.status(401).json(data)
    }

}

export default new apiResponse;