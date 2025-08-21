const jwt = require('jsonwebtoken'); //jwt是jsonwebtoken库，用于生成token
const {
    User
} = require('../models');
const {
    UnauthorizedError //未授权
} = require('../utils/errors'); //错误类
const {
    success,
    failure
} = require('../utils/responses'); //响应类

module.exports = async (req, res, next) => {
    try {
        const {
            token
        } = req.headers; //req.headers是express的API，用于获取请求头
        if (!token) {
            throw new UnauthorizedError('请先登录。');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify是jwt的API，用于验证token。参数1是token，参数2是secret
        if (!decoded) {
            throw new UnauthorizedError('请先登录。');
        }
        const {
            userId
        } = decoded;
        req.userId = userId; // 如果通过验证，将 userId 挂载到 req 上，方便后续中间件或路由使用
        next(); //next是express的API，用于调用下一个中间件
    } catch (error) {
        failure(res, error);
    }
};