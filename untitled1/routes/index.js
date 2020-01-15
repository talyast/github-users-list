var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //if (req.session.isLoggedIn)
  // /github
  // if not
  // /login
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render('login')
})
module.exports = router;
