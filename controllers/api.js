const Pic = require('../models/Pic');
exports.addImg = (req, res) => {
  const newPic=new Pic({
    link:req.body.link,
    caption:req.body.caption,
    owner:req.session.twitterID,
    owner_img:req.session.dpLink
  })
  newPic.save(function(err,pic){
    if(err) throw err;
    res.redirect('/pic/'+pic._id)
  })
}
exports.deleteImg = (req,res) => {
  console.log(req.body)
  Pic.findOneAndRemove({_id:req.params.id},function(err,data){
    if(err) throw err
    console.log(data)
    res.end()
  })
}
