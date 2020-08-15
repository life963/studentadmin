//引入mongoose
var mongoose = require('mongoose');


// //定义传输来的数据类型，叫做定义骨架
var adminSchema = mongoose.Schema({
    //如果不需要从前端获取数据，这里可以不写类型
    id: String,
    name: String,
    sex: String,
    email: String,
    phone: String,
    imgurl: String
});

//创建一个模型，admins是数据库内的集合名称，没有就会创建一个
var studentsModel = mongoose.model('students', adminSchema);

//暴露模型
module.exports = studentsModel;