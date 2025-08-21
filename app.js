const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan'); //morgan是nodejs的日志库，用于记录请求日志
const dotenv = require('dotenv'); //dotenv是nodejs的配置库，用于读取.env文件
dotenv.config(); //读取.env文件
const cors = require('cors'); //cors是nodejs的跨域库，用于处理跨域请求

//前台路由
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const likesRouter = require('./routes/likes');
//后台管理路由
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

//中间件
const adminAuthMiddleware = require('./middlewares/admin-auth');
const userAuthMiddleware = require('./middlewares/user-auth');
const app = express();

app.use(logger('dev')); //dev是日志格式，dev是开发环境，prod是生产环境
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cors是nodejs的跨域库，用于处理跨域请求。origin是允许的域名，credentials是允许携带cookie
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://clwy.cn'
    ], //允许的域名
    credentials: true //允许携带cookie
})); //cors是nodejs的跨域库，用于处理跨域请求

//前台路由
app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuthMiddleware, usersRouter);
app.use('/likes', userAuthMiddleware, likesRouter);
//后台管理路由
// app.use()是express的中间件,用于处理请求,adminArticlesRouter是文章管理路由,admin/articles是路由的访问路径，adminAuthMiddleware是管理员认证中间件
app.use('/admin/articles', adminAuthMiddleware, adminArticlesRouter);
app.use('/admin/categories', adminAuthMiddleware, adminCategoriesRouter);
app.use('/admin/settings', adminAuthMiddleware, adminSettingsRouter);
app.use('/admin/users', adminAuthMiddleware, adminUsersRouter);
app.use('/admin/courses', adminAuthMiddleware, adminCoursesRouter);
app.use('/admin/chapters', adminAuthMiddleware, adminChaptersRouter);
app.use('/admin/charts', adminAuthMiddleware, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);
//作用: 导出app对象, 用于在其他文件中引入app对象
module.exports = app;