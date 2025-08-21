/**
 * 自定义 400 错误类，请求错误
 */
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError'; // 错误名称，用于区分不同类型的错误
    }
}

/**
 * 自定义 401 错误类，未授权，表示认证失败
 */
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * 自定义 404 错误类，未找到
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}