const express = require('express');
const router = express.Router();
const {
    Category
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
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank: *}}
 */
async function getCurrentCategory(req) {
    const {
        id
    } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
        throw new NotFoundError(`id为${id}的分类不存在`);
    }
    return category;
}

// 获取分类列表
router.get('/', async (req, res) => {
    try {
        const currentPage = Math.abs(Number(req.query.currentPage)) || 1;
        const pageSize = Math.abs(Number(req.query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const limit = pageSize;
        const conditions = {
            // 排序,order是排序的参数，第一个参数是排序的字段，第二个参数是排序的方式，desc是降序，asc是升序
            order: [
                ['rank', 'asc'],
                ['id', 'asc']
            ]
        }
        if (req.query.name) {
            // 模糊查询,where是查询条件，name是查询的字段，[Op.like]是模糊查询的运算符，%是通配符，%${req.query.name}%是查询条件
            conditions.where = {
                name: {
                    [Op.like]: `%${req.query.name}%`
                }
            }
        }
        // 获取所有分类
        //count是总条数，rows是查询结果
        const {
            rows,
            count
        } = await Category.findAndCountAll({
            ...conditions,
            offset,
            limit
        });
        // 返回分类列表
        success(res, '获取分类列表成功', {
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

// 获取单个分类
router.get('/:id', async (req, res) => {
    try {
        const category = await getCurrentCategory(req);
        success(res, '获取分类成功', {
            category
        });
    } catch (error) {
        failure(res, error);
    }
});

// 创建分类
router.post('/', async (req, res) => {
    try {
        const body = filterBody(req.body);
        const category = await Category.create(body);
        success(res, '创建分类成功', {
            category
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

//删除分类
router.delete('/:id', async (req, res) => {
    try {
        const category = await getCurrentCategory(req);
        await category.destroy();
        success(res, '删除分类成功');
    } catch (error) {
        failure(res, error);
    }
});

// 更新分类
router.put('/:id', async (req, res) => {
    try {
        const category = await getCurrentCategory(req);
        const body = filterBody(req.body);
        await category.update(body);
        success(res, '更新分类成功', {
            category
        });
    } catch (error) {
        failure(res, error);
    }
});

//过滤body中的字段，只保留id、name、rank
function filterBody(body) {
    return {
        name: body.name,
        rank: body.rank
    }
}
module.exports = router;