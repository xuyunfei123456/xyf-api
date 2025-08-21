const express = require('express');
const router = express.Router();
const {
    User
} = require('../../models');
//op是sequelize的运算符，用于查询条件, 比如等于、大于、小于、不等于、包含、不包含、模糊查询等
const {
    Op
} = require('sequelize');
const {
    NotFoundError
} = require('../../utils/errors');
const {
    success,
    failure
} = require('../../utils/responses'); //导入自定义的错误类


/**
 * 公共方法：查询当前用户
 */
async function getCurrentUser(req) {
    const {
        id
    } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`id为${id}的用户不存在`);
    }
    return user;
}

// 获取用户列表
router.get('/', async (req, res) => {
    try {
        const currentPage = Math.abs(Number(req.query.currentPage)) || 1;
        const pageSize = Math.abs(Number(req.query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const limit = pageSize;
        const conditions = {
            // 排序,order是排序的参数，第一个参数是排序的字段，第二个参数是排序的方式，desc是降序，asc是升序
            order: [
                ['id', 'asc']
            ]
        }
        if (req.query.email) {
            conditions.where = {
                email: {
                    [Op.eq]: req.query.email
                }
            };
        }

        if (req.query.username) {
            conditions.where = {
                username: {
                    [Op.eq]: req.query.username
                }
            };
        }

        if (req.query.nickname) {
            conditions.where = {
                nickname: {
                    [Op.like]: `%${ req.query.nickname }%`
                }
            };
        }

        if (req.query.role) {
            conditions.where = {
                role: {
                    [Op.eq]: req.query.role
                }
            };
        }

        // 获取所有用户
        //count是总条数，rows是查询结果
        const {
            rows,
            count
        } = await User.findAndCountAll({
            ...conditions,
            offset,
            limit
        });
        // 返回用户列表
        success(res, '获取用户列表成功', {
            data: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        failure(res, error);
    }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
    try {
        const user = await getCurrentUser(req);
        success(res, '获取用户成功', {
            user
        });
    } catch (error) {
        failure(res, error);
    }
});

// 创建用户
router.post('/', async (req, res) => {
    try {
        const body = filterBody(req.body);
        const user = await User.create(body);
        success(res, '创建用户成功', {
            user
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

// 更新用户
router.put('/:id', async (req, res) => {
    try {
        const user = await getCurrentUser(req);
        const body = filterBody(req.body);
        await user.update(body);
        success(res, '更新用户成功', {
            user
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, role: (number|string|*), introduce: ({type: *}|*), sex: ({allowNull: boolean, type: *, validate: {notNull: {msg: string}, notEmpty: {msg: string}, isIn: {args: [number[]], msg: string}}}|{defaultValue: number, allowNull: boolean, type: *}|*), nickname: (string|*), company: ({type: *}|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*), email: (string|*), username}}
 */
function filterBody(body) {
    return {
        email: body.email,
        username: body.username,
        password: body.password,
        nickname: body.nickname,
        sex: body.sex,
        company: body.company,
        introduce: body.introduce,
        role: body.role,
        avatar: body.avatar
    };
}

module.exports = router;