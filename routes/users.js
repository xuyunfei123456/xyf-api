const express = require('express');
const router = express.Router();
const {
    User
} = require('../models');
const {
    success,
    failure
} = require('../utils/responses');
const {
    BadRequestError,
    NotFoundError
} = require("../utils/errors");
const bcrypt = require('bcryptjs');

/**
 * 查询当前登录用户详情
 * GET /users/me
 */
router.get('/me', async function (req, res) {
    try {
        const user = await getUser(req);
        success(res, '查询当前用户信息成功。', {
            user
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：查询当前用户
 */
async function getUser(req, showPassword = false) {
    const id = req.userId;
    let condition = {};
    if (!showPassword) {
        condition.attributes = {
            exclude: ['password']
        };
    }
    const user = await User.findByPk(id, condition); //findByPk全称是findByPrimaryKey，用于根据主键查询数据

    if (!user) {
        throw new NotFoundError(`ID: ${ id }的用户未找到。`)
    }

    return user;
}

/**
 * 更新用户信息
 * PUT /users/info
 */
router.put('/info', async function (req, res) {
    try {
        const body = {
            nickname: req.body.nickname,
            sex: req.body.sex,
            company: req.body.company,
            introduce: req.body.introduce,
            avatar: req.body.avatar
        };

        const user = await getUser(req);
        await user.update(body);
        success(res, '更新用户信息成功。', {
            user
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新账户信息
 * PUT /users/account
 */
router.put('/account', async function (req, res) {
    try {
        const body = {
            email: req.body.email,
            username: req.body.username,
            currentPassword: req.body.currentPassword,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        if (!body.currentPassword) {
            throw new BadRequestError('当前密码必须填写。');
        }

        if (body.password !== body.passwordConfirmation) {
            throw new BadRequestError('两次输入的密码不一致。');
        }

        // 加上 true 参数，可以查询到加密后的密码
        const user = await getUser(req, true);

        // 验证当前密码是否正确
        const isPasswordValid = bcrypt.compareSync(body.currentPassword, user.password); //compareSync是bcrypt的API，用于验证密码。bcrypt是bcryptjs的API，用于加密密码
        if (!isPasswordValid) {
            throw new BadRequestError('当前密码不正确。');
        }

        await user.update(body); //update是sequelize的API，用于更新数据

        // 删除密码
        delete user.dataValues.password;
        success(res, '更新账户信息成功。', {
            user
        });
    } catch (error) {
        failure(res, error);
    }
});


module.exports = router;