var express = require('express');
var router = express.Router();

//引用multer第三方模块用于磁盘数据存储
var multer = require('multer')
    //用于储存路径
var path = require('path');

//引用adminModel模型
var studentsModel = require("../model/students");

let uploadurl = ""; //储存图片的地址

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // 来存放文件的地址
        // path用来处理路径的第三方模块， jion用来拼接路径
        cb(null, path.join(__dirname, '../public/upload'))
    },
    filename: function(req, file, cb) {
        console.log(file);
        //图片的名称在file里的originalname内,需要获取文件的后缀，所以先转数组再获取
        let url = file.fieldname + '-' + Date.now() + '.' + file.originalname.split(".")[1];
        uploadurl = "/upload/" + url;
        //修改文件的名称
        cb(null, url)
    }
})

var upload = multer({ storage: storage })

//传递数据渲染列表
router.post('/list', function(req, res, next) {
    //post方法，数据用body获取
    let total = 0; //用于记录数据条数
    studentsModel.count({}, (err, count) => {
        //调用方法记录总数据条数
        total = count;
    });
    //获取前端传过来的当前页码和限制每页显示的条数
    const { page, count, user } = req.body;
    console.log(req.body);
    if (user) {
        console.log(11111111111111111111111111111111111111, user);
        //查找该集合的符合目标的数据
        studentsModel.find({ name: user }, (err, doc) => {
            if (err) throw err;
            //前端查找的数据，find查找的数据以[{},{}]形式，findOne以对象的形式
            res.json({
                result: doc,
                total,
                status: 0
            });
        })
    } else {
        //查找该集合的所有数据
        studentsModel.find({}).skip((page - 1) * count).limit(+count).exec((err, doc) => {
            if (err) throw err;
            //前端查找的数据，find查找的数据以[{},{}]形式，findOne以对象的形式
            res.json({
                result: doc,
                total,
                status: 0
            });
        })
    }
});

//更新数据
router.post('/updata', function(req, res, next) {
    //post方法，数据用body获取，get用query获取
    //获取前端注册的信息
    console.log(req.body); //获取前端传过来的数据
    const { id } = req.body; //获取id
    studentsModel.updateOne({ _id: id }, req.body, (err, doc) => { //除了增加数据是实例增加，其他的都是使用模型
        if (err) throw err;
        //前端查找的数据，符合的数据以数组的形式输出[{},{}],所以如果长度为0，也就是false，那就说明没有该用户名存在
        res.json({
            status: 0,
            msg: "修改成功"
        })
    })

});

//增加数据
// router.post('/add', function(req, res, next) {
//     //post方法，数据用body获取，get用query获取
//     //获取前端注册的信息
//     console.log(req.body); //获取前端传过来的数据
//     //创建实例
//     const studentsEnity = new studentsModel(req.body);
//     studentsEnity.save(err => { //实例去增加数据库信息
//         if (err) throw err;
//         res.json({
//             status: 0,
//             msg: "注册成功"
//         })
//     })
// });

//删除数据
router.post('/del', function(req, res, next) {
    //post方法，数据用body获取，get用query获取
    //获取前端注册的信息
    console.log(req.body); //获取前端传过来的数据
    const id = req.body.id
    studentsModel.remove({ _id: id }, (err, doc) => {
        if (err) throw err;
        res.json({
            status: 0,
            meg: "删除成功"
        })
    })
});


//增加数据,包含头像图片
router.post('/upload', upload.any(), function(req, res, next) {
    //post方法，数据用body获取，get用query获取
    //获取前端注册的信息
    console.log(req.body); //获取前端传过来的数据
    //创建实例
    const studentsEnity = new studentsModel({ imgurl: uploadurl, ...req.body });
    studentsEnity.save(err => { //实例去增加数据库信息
        if (err) throw err;
        res.json({
            status: 0,
            msg: "注册成功"
        })
    })
});







module.exports = router;