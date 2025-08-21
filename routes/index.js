const express = require('express');
const router = express.Router();
const {
  Course,
  Category,
  User
} = require('../models');
const {
  success,
  failure
} = require('../utils/responses');

/**
 * 查询首页数据
 * GET /
 */
router.get('/', async function (req, res, next) {
  try {
    // 焦点图（推荐的课程）
    const recommendedCourses = await Course.findAll({
      attributes: {
        exclude: ['CategoryId', 'UserId', 'content']
      },
      include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name'] //category是分类表，as是别名，attributes是属性，id和name是分类表的id和name字段
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company'] //user是用户表，as是别名，attributes是属性，id、username、nickname、avatar、company是用户表的id、username、nickname、avatar、company字段
        }
      ],
      where: {
        recommended: true //recommended是课程表的推荐字段，true是推荐，false是不推荐
      },
      order: [
        ['id', 'desc']
      ],
      limit: 10 //limit是限制查询结果的数量，10是限制10条
    });

    // 人气课程
    const likesCourses = await Course.findAll({
      attributes: {
        exclude: ['CategoryId', 'UserId', 'content']
      },
      order: [
        ['likesCount', 'desc'],
        ['id', 'desc']
      ],
      limit: 10
    });
    // 入门课程
    const introductoryCourses = await Course.findAll({
      attributes: {
        exclude: ['CategoryId', 'UserId', 'content']
      },
      where: {
        introductory: true //introductory是课程表的入门字段，true是入门，false是不入门
      },
      order: [
        ['id', 'desc']
      ],
      limit: 10
    });
    success(res, '获取首页数据成功。', {
      recommendedCourses,
      likesCourses,
      introductoryCourses
    });

  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;