const express = require('express');
const router = express.Router();
const {
    Article
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
 * 公共方法：查询当前文章
 */
async function getCurrentArticle(req) {
    const {
        id
    } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError(`id为${id}的文章不存在`);
    }
    return article;
}

// 获取文章列表
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
        if (req.query.title) {
            // 模糊查询,where是查询条件，title是查询的字段，[Op.like]是模糊查询的运算符，%是通配符，%${req.query.title}%是查询条件
            conditions.where = {
                title: {
                    [Op.like]: `%${req.query.title}%`
                }
            }
        }
        // 获取所有文章
        //count是总条数，rows是查询结果
        const {
            rows,
            count
        } = await Article.findAndCountAll({
            ...conditions,
            offset,
            limit
        });
        // 返回文章列表
        success(res, '获取文章列表成功', {
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

// 获取单个文章
router.get('/:id', async (req, res) => {
    try {
        const article = await getCurrentArticle(req);
        success(res, '获取文章成功', {
            article
        });
    } catch (error) {
        failure(res, error);
    }
});

// 创建文章
router.post('/', async (req, res) => {
    try {
        const body = filterBody(req.body);
        const article = await Article.create(body);
        success(res, '创建文章成功', {
            article
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

//删除文章
router.delete('/:id', async (req, res) => {
    try {
        const article = await getCurrentArticle(req);
        await article.destroy();
        success(res, '删除文章成功');
    } catch (error) {
        failure(res, error);
    }
});

// 更新文章
router.put('/:id', async (req, res) => {
    try {
        const article = await getCurrentArticle(req);
        const body = filterBody(req.body);
        await article.update(body);
        success(res, '更新文章成功', {
            article
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：过滤body
 * @param req
 * @returns {{title, content}}
 */
function filterBody(body) {
    return {
        title: body.title,
        content: body.content
    };
}


module.exports = router;