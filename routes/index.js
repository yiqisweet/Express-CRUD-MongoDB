

var express = require('express');
var router = express.Router(); //express路由
var request = require('request'); //node request 请求

router.get('/',function(req,res){

    res.render('login',{
        title : 'login'
    });

});


//编辑
router.get('/edit-user',function(req,res){
    var UsersModel = global.dbHandel.getModel('users');
    UsersModel.findById({_id:req.query.id},function(err,doc){
        console.log(doc);
        res.render('edit-user',{
            title : '用户信息修改',
            data : doc
        });
    });

})

//详情
router.get('/user-detail',function(req,res){
    console.log("id:"+req.query)
    var UsersModel = global.dbHandel.getModel('users');
    UsersModel.findById({_id:req.query.id},function(err,doc){
        res.render('user-detail',{
            title : '用户详情页',
            data : doc
        });
});
});

//首页
router.get('/home',function(req,res){
    var UsersModel = global.dbHandel.getModel('users');
    let count =0;
    UsersModel.find({},function(err,docs){
        for(let i = 0;i < docs.length; i++){
            count += docs[i].balance;
        }
        res.render('home',{
          list : docs,
          count : count
        });
    });
})
router.get('/add-user',function(req,res){
    res.render('add-user',{
        title : '新增用户'
    });
})
//新增
router.post('/add',function(req,res){
    var UsersModel = global.dbHandel.getModel('users');
    UsersModel.create(req.body,function(err,doc){
       if(!err && doc){
           res.send({
               code : '20000',
               msg : '添加成功'
           });
       }
    });
})
//删除
router.post('/delete',function(req,res){
    var UsersModel = global.dbHandel.getModel('users');

    UsersModel.remove({_id:req.body.id},function(err,doc){
        console.log(doc.length);
        if(!err && !doc.length){
            res.send({
                code : '20000',
                msg : '删除成功'
            });
        }
    });
});

//修改
router.post('/edit',function(req,res){
        var UsersModel = global.dbHandel.getModel('users');
        console.log(req.body);
        UsersModel.update({_id:req.body.id},req.body,function(err,doc){
                 if(doc.ok > 0){
                    res.send({
                        code : '20000',
                        msg : '修改成功'
                    });
                 }
            });
})


//登录
router.post('/login',function(req,res){
    // console.log(req.body);

    var AccountsModel = global.dbHandel.getModel('accounts');

    AccountsModel.find({email:req.body.email,password:req.body.password},function(err,docs){
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