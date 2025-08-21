'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  //DataTypes是sequelize的API，用于定义数据库表的字段类型
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User 有多个 Course
      models.User.hasMany(models.Course, {
        as: 'courses',
        foreignKey: 'userId' //foreignKey是外键，userId是用户表的id字段
      });

      models.User.belongsToMany(models.Course, { //belongsToMany是sequelize的API，用于指定多对多关系
        through: models.Like, //through是sequelize的API，用于指定中间表
        foreignKey: 'userId', //foreignKey是sequelize的API，用于指定外键
        as: 'likeCourses' //as是sequelize的API，用于指定别名
      });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '邮箱必须填写。'
        },
        notEmpty: {
          msg: '邮箱不能为空。'
        },
        isEmail: {
          msg: '邮箱格式不正确。'
        },
        async isUnique(value) {
          const user = await User.findOne({
            where: {
              email: value
            }
          }) //where是查询条件，email是查询的字段，value是查询的值
          if (user) {
            throw new Error('邮箱已存在，请直接登录。');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户名必须填写。'
        },
        notEmpty: {
          msg: '用户名不能为空。'
        },
        len: {
          args: [2, 45],
          msg: '用户名长度必须是2 ~ 45之间。'
        },
        async isUnique(value) {
          const user = await User.findOne({
            where: {
              username: value
            }
          })
          if (user) {
            throw new Error('用户名已经存在。');
          }
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      //set是sequelize的API，用于设置字段的值，value是设置的值
      set(value) {
        if (!value) {
          throw new Error('密码不能为空。');
        }
        if (value.length < 6 || value.length > 45) {
          throw new Error('密码长度必须是6 ~ 45之间。');
        }
        this.setDataValue('password', bcrypt.hashSync(value, 10)); //hashSync是bcrypt的API，用于加密密码，10是加密的次数
      },
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '昵称必须填写。'
        },
        notEmpty: {
          msg: '昵称不能为空。'
        },
        len: {
          args: [2, 45],
          msg: '昵称长度必须是2 ~ 45之间。'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '性别必须填写。'
        },
        notEmpty: {
          msg: '性别不能为空。'
        },
        isIn: { //isIn是sequelize的API，用于验证字段的值是否在指定的范围内，args是参数，[0, 1, 2]是参数的值，msg是错误信息
          args: [
            [0, 1, 2]
          ],
          msg: '性别的值必须是，男性：0 女性：1 未选择：2。'
        }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户组必须选择。'
        },
        notEmpty: {
          msg: '用户组不能为空。'
        },
        isIn: {
          args: [
            [0, 100]
          ],
          msg: '用户组的值必须是，普通用户：0 管理员：100。'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '图片地址不正确。'
        }
      }
    },

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};