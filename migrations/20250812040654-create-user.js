'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //queryInterface 是 sequelize 提供的 API，用于操作数据库
  //Sequelize 是 sequelize 提供的类型，用于定义数据库表的结构
  //async up 是 sequelize 提供的 API，用于创建数据库表，async down 是 sequelize 提供的 API，用于删除数据库表
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false,
        defaultValue: 2,
        type: Sequelize.TINYINT.UNSIGNED
      },
      company: {
        type: Sequelize.STRING
      },
      introduce: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // 添加索引,addIndex 是 sequelize 提供的 API，用于添加索引
    await queryInterface.addIndex(
      'Users', {
        fields: ['email'], // 要索引的字段
        unique: true // 唯一索引
      });
    await queryInterface.addIndex(
      'Users', {
        fields: ['username'],
        unique: true
      });
    await queryInterface.addIndex(
      'Users', {
        fields: ['role']
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};