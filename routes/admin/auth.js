const express = require('express');
const router = express.Router();
const {
    User
} = require('../../models');
const {
    Op
} = require('sequelize'); //sequelize是数据库操作库，Op是sequelize的运算符，用于查询条件, 比如等于、大于、小于、不等于、包含、不包含、模糊查询等
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} = require('../../utils/errors');
const {
    success,
    failure
} = require('../../utils/responses');
const bcrypt = require('bcryptjs'); //bcrypt是密码加密库，用于加密密码
const jwt = require('jsonwebtoken'); //jwt是jsonwebtoken库，用于生成token
// const crypto = require('crypto'); //crypto是nodejs内置的加密库，用于生成token

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
    try {
        // console.log(crypto.randomBytes(32).toString('hex')); //生成32位随机字符串,hex是16进制,用于.env文件中的JWT_SECRET
        const {
            login,
            password
        } = req.body;

        if (!login) {
            throw new BadRequestError('邮箱/用户名必须填写。');
        }

        if (!password) {
            throw new BadRequestError('密码必须填写。');
        }
        const condition = {
            where: {
                [Op.or]: [ //或查询，用or，不是and
                    {
                        email: login
                    },
                    {
                        username: login
                    }
                ]
            }
        };

        // 通过email或username，查询用户是否存在
        const user = await User.findOne(condition); //findOne只能查询一条数据
        if (!user) {
            throw new NotFoundError('用户不存在，无法登录。');
        }
        if (!bcrypt.compareSync(password, user.password)) { //compareSync是bcrypt的API，用于比较密码。参数1是用户输入的密码，参数2是数据库中的密码
            throw new UnauthorizedError('密码错误。');
        }
        if (user.role !== 100) { //100是管理员角色
            throw new UnauthorizedError('用户不是管理员，无法登录。');
        }
        const token = jwt.sign({ //sign是jwt的API，用于生成token。参数1是payload，参数2是secret，参数3是options。payload是用户信息，secret是密钥，options是选项。
            userId: user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '30d' //30天过期
        });
        success(res, '登录成功。', {
            token
        });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;