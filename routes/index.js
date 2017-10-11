

var express = require('express');
var router = express.Router(); //express路由
var request = require('request'); //node request 请求

router.get('/',function(req,res){

    res.render('login',{
        title : 'login'
    });

});

router.get('/index',function(req,res){
    console.log(req.query);

    var UsersModel = global.dbHandel.getModel('users');
    UsersModel.findById({_id:req.query.id},function(err,docs){
        console.log(docs);
        res.render('index',{
            id : docs._id,
            name : docs.name,
            password : docs.password
        });
    });

})

//删除
router.post('/delete',function(req,res){
    console.log(req.body);
    request.del('http://localhost:3000/users/'+req.body.id,function(error,response,body){
        console.log(body);
    });
});

//修改
router.post('/update',function(req,res){
    request.put('http://localhost:3000/users/'+req.body.id,{json:req.body},function(error,response,body){
        console.log(body);
    });
});


//登录
router.post('/login',function(req,res){
    // console.log(req.body);

    var UsersModel = global.dbHandel.getModel('users');

    UsersModel.find({name:req.body.name,password:req.body.password},function(err,docs){
       if(!err && docs.length > 0){
           res.send({
               code : '20000',
               msg : '登录成功',
               id : docs[0]._id
           });
       }else{
           res.send({
               code : '40004',
               msg : '用户名或密码错误'
           });
       }
    });


});

//注册
router.route('/register').get(function(req,res){
    res.render('register',{
        title : 'register'
    });
}).post(function(req,res){
    request.get('http://localhost:3000/users',function(err,response,body){
        var isError = 0; //1 代表有相同用户 0 没有
        if(!err && response.statusCode === 200){
            var arr = JSON.parse(body);
            for(let i = 0;i < arr.length;i++){
                console.log(req.body);
                if(req.body.name === arr[i].name){
                    //如果数组里有一个同名的就计数1,
                    isError += 1;
                }
            }
            if(isError !== 1){
                request.post(
                    'http://localhost:3000/users',
                    {json:{name:req.body.name,password:req.body.password}},
                    function (error, response,body) {
                        if(!error && response.statusCode === 201 ){
                            res.send({
                                code : '20000',
                                msg : ' 注册成功'
                            });
                        }

                    });
            }else{
                res.send({
                    code :'30000',
                    msg : '用户名已存在'
                });
            }
        }
    });
})














module.exports = router;