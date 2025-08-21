/**
 * 请求成功
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    });
}

/**
 * 请求失败
 * @param res
 * @param error
 */
function failure(res, error) {
    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: '资源不存在',
            errors: [error.message]
        });
    }
    if (error.name === 'BadRequestError') {
        return res.status(400).json({ //400是请求参数错误
            status: false,
            message: '请求参数错误',
            errors: [error.message]
        });
    }
    if (error.name === 'UnauthorizedError') { // 认证失败
        return res.status(401).json({ //401是未授权
            status: false,
            message: '认证失败',
            errors: [error.message]
        });
    }
    if (error.name === 'JsonWebTokenError') { //JsonWebTokenError是jwt的错误类，表示token错误
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['您提交的 token 错误。']
        });
    }

    if (error.name === 'TokenExpiredError') { //TokenExpiredError是jwt的错误类，表示token过期
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['您的 token 已过期。']
        });
    }
    return res.status(500).json({
        status: false,
        message: '服务器错误',
        errors: [error.message]
    });
}

module.exports = { //和export default 类似，都是导出模块.区别是，export default 只能导出一个模块，而module.exports 可以导出多个模块。
    success,
    failure
}