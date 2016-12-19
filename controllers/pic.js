const Pic = require('../models/Pic');
exports.index = (req, res) => {
  Pic.find({},function(err,data){
    if(err) throw err
    res.render('index', {
      title: 'Home',
      obj:data,
      user:req.session
    })
  })
}
exports.myPics = (req, res) => {
  Pic.find({owner:req.session.twitterID},function(err,data){
    if(err) throw err
    res.render('index', {
      title: 'Home',
      obj:data,
      user:req.session
    })
  })
}
