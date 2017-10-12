

//存放表结构骨架 和 model 名称

module.exports = {
    accounts : {
        email : { type : String },
        password : { type : String }
    },
    users:{
        name : { type : String},
        age : {type : Number,default : 0},
        email : { type : String},
        phone : { type : Number},
        balance : { type : Number,default : 0}
    }
};

