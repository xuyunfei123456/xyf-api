'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
moment.locale('zh-cn');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      models.Course.hasMany(models.Chapter, {
        as: 'chapters'
      });

      // Course 属于 Category
      models.Course.belongsTo(models.Category, {
        as: 'category',
        foreignKey: 'categoryId'
      });

      // Course 属于 User  
      models.Course.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      });

      models.Course.belongsToMany(models.User, { //belongsToMany是sequelize的API，用于指定多对多关系
        through: models.Like, //through是sequelize的API，用于指定中间表
        foreignKey: 'courseId', //foreignKey是sequelize的API，用于指定外键
        as: 'likeUsers' //as是sequelize的API，用于指定别名
      });
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '分类ID必须填写。'
        },
        notEmpty: {
          msg: '分类ID不能为空。'
        },
        async isPresent(value) {
          //在验证里，要用到其他模型，前面要加上sequelize.models
          //sequelize.models.Category是sequelize的API，用于查询数据库中的Category表，findByPk是查询单条数据，value是查询的值,确保提交的数据有对应的分类
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value} 的分类不存在。`);
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户ID必须填写。'
        },
        notEmpty: {
          msg: '用户ID不能为空。'
        },
        async isPresent(value) {
          //在验证里，要用到其他模型，前面要加上sequelize.models
          //sequelize.models.User是sequelize的API，用于查询数据库中的User表，findByPk是查询单条数据，value是查询的值,确保提交的数据有对应的用户
          const user = await sequelize.models.User.findByPk(value)
          if (!user) {
            throw new Error(`ID为：${value} 的用户不存在。`);
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '名称必须填写。'
        },
        notEmpty: {
          msg: '名称不能为空。'
        },
        len: {
          args: [2, 45],
          msg: '名称长度必须是2 ~ 45之间。'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '图片地址不正确。'
        }
      }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      validate: {
        //isIn是sequelize的API，用于验证字段的值是否在指定的范围内，args是参数，[[true, false]]是参数的值，msg是错误信息
        isIn: {
          args: [
            [true, false]
          ],
          msg: '是否推荐的值必须是，推荐：true 不推荐：false。'
        }
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: {
          args: [
            [true, false]
          ],
          msg: '是否入门课程的值必须是，推荐：true 不推荐：false。'
        }
      }
    },
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE, //type是数据类型，DATE是日期类型
      get() {
        return moment(this.getDataValue("createdAt")).format("LL"); //format是moment的API，用于格式化日期，LL是长日期格式,举例：2025年8月17日
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("LL");
      }
    },

  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};