const express = require('express');
const router = express.Router();
const {
    Course,
    Chapter
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
 * 公共方法：查询当前课程
 */
async function getCurrentCourse(req) {
    const {
        id
    } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
        throw new NotFoundError(`id为${id}的课程不存在`);
    }
    return course;
}

// 获取课程列表
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
        if (req.query.categoryId) {
            //where是查询条件，categoryId是查询的字段，[Op.eq]是等于的运算符，req.query.categoryId是查询条件
            conditions.where = {
                categoryId: {
                    [Op.eq]: req.query.categoryId
                }
            };
        }

        if (req.query.userId) {
            conditions.where = {
                userId: {
                    [Op.eq]: req.query.userId
                }
            };
        }

        if (req.query.name) {
            conditions.where = {
                name: {
                    [Op.like]: `%${ req.query.name }%`
                }
            };
        }

        if (req.query.recommended) {
            conditions.where = {
                recommended: {
                    // 需要转布尔值，因为req.query.recommended是字符串，需要转成布尔值
                    [Op.eq]: req.query.recommended === 'true'
                }
            };
        }

        if (req.query.introductory) {
            conditions.where = {
                introductory: {
                    [Op.eq]: req.query.introductory === 'true'
                }
            };
        }

        // 获取所有课程
        //count是总条数，rows是查询结果
        const {
            rows,
            count
        } = await Course.findAndCountAll({
            ...conditions,
            offset,
            limit
        });
        // 返回课程列表
        success(res, '获取课程列表成功', {
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

// 获取单个课程
router.get('/:id', async (req, res) => {
    try {
        const course = await getCurrentCourse(req);
        success(res, '获取课程成功', {
            course
        });
    } catch (error) {
        failure(res, error);
    }
});

// 创建课程
router.post('/', async (req, res) => {
    try {
        const body = filterBody(req.body);
        body.userId = req.user.id;
        const course = await Course.create(body); //create是sequelize的API，用于创建数据
        success(res, '创建课程成功', {
            course
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

//删除课程
router.delete('/:id', async (req, res) => {
    try {
        const course = await getCurrentCourse(req);
        const count = await Chapter.count({
            where: { //where是查询条件，courseId是查询的字段
                courseId: req.params.id
            }
        });
        if (count > 0) {
            throw new Error('课程下有章节，不能删除');
        }
        await course.destroy();
        success(res, '删除课程成功');
    } catch (error) {
        failure(res, error);
    }
});

// 更新课程
router.put('/:id', async (req, res) => {
    try {
        const course = await getCurrentCourse(req);
        const body = filterBody(req.body);
        await course.update(body);
        success(res, '更新课程成功', {
            course
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(body) {
    return {
        categoryId: body.categoryId,
        name: body.name,
        image: body.image,
        recommended: body.recommended,
        introductory: body.introductory,
        content: body.content
    };
}

module.exports = router;