var express = require('express');
var router = express.Router();

//引入node-rsa进行加密
const NodeRSA = require('node-rsa');
//生成512位秘钥对
const key = new NodeRSA({ b: 512 });
// 用于加密/解密的填充方案
key.setOptions({ encryptionScheme: 'pkcs1' })

//引用adminModel模型
var adminModel = require("../model/admin");


//发送公钥
router.get('/key', function(req, res, next) {
    let publicKey = key.exportKey('public'); //生成公钥
    res.json({
        publicKey: publicKey
    });
})

router.post('/register', function(req, res, next) {
    //post方法，数据用body获取，get用query获取
    //获取前端注册的信息
    console.log(req.body);
    let decrypted = key.decrypt(req.body.loginInfo, 'utf8'); //解密req.body.loginInfo的内容
    console.log(decrypted); //获取解密后的内容
    let decryptedobj = JSON.parse(decrypted); //字符串转对象形式
    //采用解构赋值，获取用户名数据
    const { username } = decryptedobj;
    //创建实例
    const adminEnity = new adminModel(decryptedobj);

    adminModel.find({ username }, (err, doc) => { //原型查找是否存在用户名
        if (err) throw err;
        //前端查找的数据，符合的数据以数组的形式输出[{},{}],所以如果长度为0，也就是false，那就说明没有该用户名存在
        if (doc.length) {
            res.json({
                status: 1,
                msg: "用户名已存在"
            })
        } else {
            adminEnity.save(err => { //实例去增加数据库信息
                if (err) throw err;
                res.json({
                    status: 0,
                    msg: "注册成功"
                })
            })
        }
    })

});

router.post('/login', function(req, res, next) {
    //post方法，数据用body获取
    //获取前端注册的信息
    let decrypted = key.decrypt(req.body.loginInfo, 'utf8'); //解密req.body.loginInfo的内容
    console.log(decrypted); //获取解密后的内容
    let decryptedobj = JSON.parse(decrypted); //字符串转对象形式
    //采用解构赋值，获取用户名数据
    const { username, password } = decryptedobj;
    //创建实例
    // const adminEnity = new adminModel(req.body);
    adminModel.find({ username, password }, (err, doc) => { //原型查找是否存在用户名
        if (err) throw err;
        //前端查找的数据，符合的数据以数组的形式输出[{},{}],所以如果长度为0，也就是false，那就说明没有该用户名存在
        if (doc.length !== 0) {
            res.json({
                status: 0,
                msg: "登录成功"
            })
        } else {
            res.json({
                status: 1,
                msg: "用户名或密码错误"
            })
        }
    })

});

module.exports = router;