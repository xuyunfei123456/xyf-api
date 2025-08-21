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
        } = req.headers;
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
        const user = await User.findByPk(userId); //findByPk是sequelize的API，用于根据主键查询数据
        if (!user) {
            throw new UnauthorizedError('用户不存在。');
        }
        if (user.role !== 100) {
            throw new UnauthorizedError('用户不是管理员。');
        }
        req.user = user; // 如果通过验证，将 user 对象挂载到 req 上，方便后续中间件或路由使用
        next(); //next是express的API，用于调用下一个中间件
    } catch (error) {
        failure(res, error);
    }
};