//引入mongoose
var mongoose = require('mongoose');


//定义传输来的数据类型，叫做定义骨架
var adminSchema = mongoose.Schema({
    username: String,
    password: String
});

//创建一个模型，admins是数据库内的集合名称，没有就会创建一个
var adminModel = mongoose.model('admins', adminSchema);

//暴露模型
module.exports = adminModel;