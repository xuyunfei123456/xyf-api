'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // 插入数据
  async up(queryInterface, Sequelize) {
    const articles = []
    const counts = 100
    for (let i = 0; i < counts; i++) {
      const artticle = {
        title: `文章${i + 1}`,
        content: `文章内容${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      articles.push(artticle)
    };
    await queryInterface.bulkInsert('Articles', articles)
  },
  // 删除数据
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {})
  }
};