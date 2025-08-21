'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //up是sequelize的API，用于向数据库中插入数据
  //queryInterface是sequelize的API，用于操作数据库
  //Sequelize是sequelize的类型，用于定义数据库表的结构
  async up(queryInterface, Sequelize) {
    //bulkInsert是sequelize的API，用于向数据库中插入多条数据
    await queryInterface.bulkInsert('Settings', [{
      name: '长乐未央',
      icp: '鄂ICP备13016268号-11',
      copyright: '© 2013 Changle Weiyang Inc. All Rights Reserved.',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  //down是sequelize的API，用于删除数据库中的数据
  async down(queryInterface, Sequelize) {
    //bulkDelete是sequelize的API，用于删除数据库中的多条数据
    //bulkDelete的参数是：表名，条件，回调函数
    await queryInterface.bulkDelete('Settings', null, {});
  }

};