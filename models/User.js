var mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');
var bcrypt   = require("bcrypt-nodejs");

// schema
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,"아이디를 입력해주세요"],
    trim:true,
    unique:true,
    select:true
  },
  password:{
    type:String,
    select:false
  },
  name:{
    type:String,
    required:[true,"별명을 입력해주세요"],
    trim:true,
    select:true
  },
  email:{
    type:String,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일형식에 맞춰 입력해주세요"],
    trim:true,
    select:true
  },
  provider:{
    type:String
  },
  providerId:String,
  providerData:{},
  createdAt:{
    type:Date,
    default:Date.now,
    select:true
  }
},{
  toObject:{virtuals:true}
});

// virtuals
userSchema.virtual("passwordConfirmation")
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "숫자와 문자를 포함하여 8자 이상 입력해주세요";
userSchema.path("password").validate(function(v) {
  var user = this;

  // create user
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate("passwordConfirmation", "비밀번호를 재입력해주세요");
    }
    if(!passwordRegex.test(user.password)){
      user.invalidate("password", passwordRegexErrorMessage);
    } else if(user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 맞지 않습니다");
    }
  }

  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate("currentPassword", "현재 비밀번호를 입력해주세요");
    }
    if(user.currentPassword && !user.authenticate(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "현재 비밀번호가 맞지않습니다");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호를 재입력해주세요");
    }
  }
});

// plugin
userSchema.plugin(findOrCreate);

// hash password
userSchema.pre("save", function (next){
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password, originalPassword) {
  var user = this;
  if(originalPassword){
    return bcrypt.compareSync(password, originalPassword);
  } else {
    return bcrypt.compareSync(password, user.password);
  }
};

// model & export
var User = mongoose.model("user", userSchema);
module.exports = User;
