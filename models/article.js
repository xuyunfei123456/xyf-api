'use strict';
const {
  Model
} = require('sequelize');
//DataTypes 是sequelize的类型，sequelize是数据库的连接对象
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // define association here
    }
  }
  // 初始化文章模型, 定义字段, 表名, 模型名.init第一个参数是字段，第二个参数是配置
  Article.init({
    title: {
      type: DataTypes.STRING, //字符串类型
      allowNull: false, //和notNull的区别是，allowNull是字段是否可以为空，notNull是字段是否可以为null
      validate: {
        notEmpty: {
          msg: '标题不能为空'
        },
        notNull: {
          msg: '标题不能为null'
        },
        len: {
          args: [1, 10],
          msg: '标题长度在1到10之间'
        }
      }
    },
    content: {
      type: DataTypes.TEXT, //文本类型
      allowNull: false, //和notNull的区别是，allowNull是字段是否可以为空，notNull是字段是否可以为null
      validate: {
        notEmpty: {
          msg: '内容不能为空'
        },
        notNull: {
          msg: '内容不能为null'
        },
        len: {
          args: [1, 10],
          msg: '标题长度在1到10之间'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};