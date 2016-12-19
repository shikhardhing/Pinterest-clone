const mongoose = require('mongoose')
const picSchema=new mongoose.Schema({
  link:String,
  caption:String,
  owner:Number,
  owner_img:String
})
const Pic = mongoose.model('Pic', picSchema);
module.exports = Pic;
