const express = require('express');
const router = express.Router();
const {
    Setting
} = require('../../models');
const {
    NotFoundError
} = require('../../utils/errors');
const {
    success,
    failure
} = require('../../utils/responses'); //导入自定义的错误类


/**
 * 公共方法：查询当前系统设置
 */
async function getCurrentSetting() {
    const setting = await Setting.findOne(); //findOne，可以用它来查询数据库中符合条件的第一条记录
    if (!setting) {
        throw new NotFoundError(`初始系统设置未找到，请运行种子文件`);
    }
    return setting;
}

// 获取系统设置列表
router.get('/', async (req, res) => {
    try {
        const setting = await getCurrentSetting();
        // 返回系统设置列表
        success(res, '获取系统设置列表成功', {
            data: setting
        });
    } catch (error) {
        failure(res, error);
    }
});

// 更新系统设置
router.put('/', async (req, res) => {
    try {
        const setting = await getCurrentSetting();
        const body = filterBody(req.body);
        await setting.update(body); //update是sequelize的API，用于更新数据库中的数据
        success(res, '更新系统设置成功', {
            setting
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{copyright: (string|*), icp: (string|string|DocumentFragment|*), name}}
 */
function filterBody(body) {
    return {
        name: body.name,
        icp: body.icp,
        copyright: body.copyright
    };
}

module.exports = router;