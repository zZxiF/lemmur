var express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');
const userController = require('../controllers/user');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lemur' });
});

//Sesion

router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.delete('/login', sessionController.destroy);

module.exports = router;
