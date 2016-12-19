var mongoose = require("mongoose");
var util = require("../config/util");

// schema
var postSchema = mongoose.Schema({
  author:{
    type:String,
    required:[true,"이름을 입력해주세요"]
  },
  title:{
    type:String,
    required:[true,"제목을 입력해주세요"]
  },
  body:{
    type:String,
    required:[true,"내용을 입력해주세요"]
  },
  phone:{
      type:String,
      required:[true,"연락처를 입력해주세요"]
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  updatedAt:{
    type:Date
  },
  username:{
    type:String
  }
},{
  toObject:{virtuals:true}
});

// virtuals
postSchema.virtual("createdDate")
.get(function(){
  return util.getDate(this.createdAt);
});
postSchema.virtual("createdTime")
.get(function(){
  return util.getTime(this.createdAt);
});
postSchema.virtual("updatedDate")
.get(function(){
  return util.getDate(this.updatedAt);
});
postSchema.virtual("updatedTime")
.get(function(){
  return util.getTime(this.updatedAt);
});


// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;
