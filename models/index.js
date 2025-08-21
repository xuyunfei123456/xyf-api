'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
// 如果配置了环境变量, 则使用环境变量, 否则使用配置文件中的数据库配置
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 读取models目录下的所有文件, 并导入到db对象中, 每个文件都是一个模型,自动加载模型
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  // 如果模型有associate方法, 则调用associate方法, 关联其他模型
  //associate是模型中的一个方法, 用于关联其他模型，比如文章模型关联用户模型
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 导出数据库的连接对象和模型对象
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//该文件的作用是导出数据库的连接对象和模型对象
//其他文件可以通过require('../../models')引入该文件，然后通过db.Article访问文章模型
module.exports = db;