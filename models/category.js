'use strict';
const {
  Model
} = require('sequelize');
//DataTypes的作用是定义数据库表的字段类型
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category 有多个 Course
      models.Category.hasMany(models.Course, {
        as: 'courses',
        foreignKey: 'categoryId' //foreignKey是外键，categoryId是分类表的id字段
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING, //字符串类型
      allowNull: false,
      //作用：验证名称是否唯一
      //参数：value是验证的值
      //返回：如果名称已存在，则抛出错误
      async isUnique(value) {
        const category = await Category.findOne({
          where: {
            name: value
          }
        }) //where是查询条件，name是查询的字段，value是查询的值
        if (category) {
          throw new Error('名称已存在，请选择其他名称。');
        }
      },
      validate: {
        notNull: {
          msg: '名称必须填写。'
        },
        notEmpty: {
          msg: '名称不能为空。'
        },
        len: {
          args: [2, 45],
          msg: '长度必须是2 ~ 45之间。'
        }
      }
    },

    rank: {
      type: DataTypes.INTEGER, //整数类型
      allowNull: false,
      validate: {
        notNull: { //notNull是字段是否可以为null 
          msg: '排序必须填写。'
        },
        notEmpty: { //notEmpty是字段是否可以为空，notNull是字段是否可以为null 
          msg: '排序不能为空。'
        },
        isInt: {
          msg: '排序必须为整数。'
        },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须是正整数。');
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};