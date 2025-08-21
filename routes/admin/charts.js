const express = require('express');
const router = express.Router();
const {
    sequelize,
    User
} = require('../../models');
const {
    Op
} = require('sequelize');
const {
    success,
    failure
} = require('../../utils/responses'); //导入自定义的错误类

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res) {
    try {
        //count是sequelize的API，用于统计查询结果的条数
        //where是查询条件，sex是查询的字段，0是查询的值
        const male = await User.count({
            where: {
                sex: 0
            }
        });
        const female = await User.count({
            where: {
                sex: 1
            }
        });
        const unknown = await User.count({
            where: {
                sex: 2
            }
        });

        const data = [{
                value: male,
                name: '男性'
            },
            {
                value: female,
                name: '女性'
            },
            {
                value: unknown,
                name: '未选择'
            }
        ];

        success(res, '查询用户性别成功。', {
            data
        });

    } catch (error) {
        failure(res, error);
    }
});
/**
 * 统计每个月用户数量
 * GET /admin/charts/user
 */
router.get('/user', async (req, res) => {
    try {
        //query是sequelize的API，用于执行查询语句
        //SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC
        //DATE_FORMAT是MySQL的函数，用于格式化日期
        //`createdAt`是查询的字段，%Y-%m是格式化的格式，AS `month`是别名，COUNT(*)是统计查询结果的条数，AS `value`是别名
        //GROUP BY `month`是分组，ORDER BY `month` ASC是排序，ASC是升序，DESC是降序
        //`Users`是表名
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC");

        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });

        success(res, '查询每月用户数量成功。', {
            data
        });

    } catch (error) {
        failure(res, error);
    }
});


module.exports = router;