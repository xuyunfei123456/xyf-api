const express = require('express');
const router = express.Router();
const {
    Chapter,
    Course
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
 * 公共方法：查询当前章节
 */
async function getCurrentChapter(req) {
    const {
        id
    } = req.params;
    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
        throw new NotFoundError(`id为${id}的章节不存在`);
    }
    return chapter;
}

// 获取章节列表
router.get('/', async (req, res) => {
    try {
        const currentPage = Math.abs(Number(req.query.currentPage)) || 1;
        const pageSize = Math.abs(Number(req.query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const limit = pageSize;
        if (!req.query.courseId) {
            throw new Error('课程id不能为空');
        }
        const conditions = {
            ...getCondition(),
            order: [
                ['rank', 'asc'],
                ['id', 'asc']
            ],
            limit,
            offset
        }
        conditions.where = { //where是查询条件，courseId是查询的字段，[Op.eq]是等于的运算符，req.query.courseId是查询的值
            courseId: {
                //Op是sequelize的运算符，用于查询条件, 比如等于、大于、小于、不等于、包含、不包含、模糊查询等
                [Op.eq]: req.query.courseId
            }
        }
        if (req.query.title) {
            conditions.where.title = { //title是查询的字段，[Op.like]是模糊查询的运算符，%${req.query.title}%是查询条件
                [Op.like]: `%${req.query.title}%`
            }
        }
        // 获取所有章节
        //count是总条数，rows是查询结果
        const {
            rows,
            count
        } = await Chapter.findAndCountAll({
            ...conditions,
            offset,
            limit
        });
        // 返回章节列表
        success(res, '获取章节列表成功', {
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

// 获取单个章节
router.get('/:id', async (req, res) => {
    try {
        const chapter = await getCurrentChapter(req);
        success(res, '获取章节成功', {
            chapter
        });
    } catch (error) {
        failure(res, error);
    }
});

// 创建章节
router.post('/', async (req, res) => {
    try {
        const body = filterBody(req.body);
        const chapter = await Chapter.create(body);
        success(res, '创建章节成功', {
            chapter
        }, 201);
    } catch (error) {
        failure(res, error);
    }
});

//删除章节
router.delete('/:id', async (req, res) => {
    try {
        const chapter = await getCurrentChapter(req);
        await chapter.destroy();
        success(res, '删除章节成功');
    } catch (error) {
        failure(res, error);
    }
});

// 更新章节
router.put('/:id', async (req, res) => {
    try {
        const chapter = await getCurrentChapter(req);
        const body = filterBody(req.body);
        await chapter.update(body);
        success(res, '更新章节成功', {
            chapter
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(body) {
    return {
        courseId: body.courseId,
        title: body.title,
        content: body.content,
        video: body.video,
        rank: body.rank
    };
}

/**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: {
            // 排除CourseId字段
            exclude: ['CourseId']
        },
        include: [{
            model: Course,
            as: 'course', //关联课程表,as是别名，可以用来区分同一个表的多个关联。
            attributes: ['id', 'name'] //关联课程表的id和name字段
        }]
    }
}


/**
 * 公共方法：查询当前章节
 */
async function getChapter(req) {
    const {
        id
    } = req.params;
    const condition = getCondition();
    //findByPk是查询单个章节,condition是查询条件,id是查询的id.
    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
        throw new NotFoundError(`ID: ${ id }的章节未找到。`)
    }

    return chapter;
}

module.exports = router;