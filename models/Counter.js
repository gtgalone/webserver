var mongoose = require('mongoose');

var visitorSchema = mongoose.Schema({
  ip: {type:String, required:true},
  totalCount: {type:Number, required:true},
  todayCount: {type:Number},
  monthlyCount: {type:Number},
  date: {type:String}
});

var Visitor = mongoose.model('visitor',visitorSchema);
module.exports = Visitor;
