var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Model = require('./model');
var bodyParser = require('body-parser');

var getConnection  = require('./connectionpool');


var sessionIdArr = [];
var userArr = [];

//************************************************************

var hearing = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var sessionId = req.params.sessionId;
    sessionIdArr.push(sessionId);
    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('hearing', {
      title: 'Hearing',
      user: user
    });
  }
};
//-------------------------------------------------------
var hearingPost = function(req, res, next) {

  var user = req.user;
  var sessionId = sessionIdArr;
  getConnection(function (err, connection) {
    connection.query('INSERT INTO hearing(username, userId, sessionId, hearingaid, rightear, leftear, right500, right1000, right2000, left500, left1000, left2000) VALUES(' + "'" + user.attributes.username + "'," + "'" + user.attributes.userId + "'," + "'" + sessionId + "'," + "'" + req.body.hearingaid + "'," + "'" + req.body.rightear + "'," + "'" + req.body.leftear + "'," + "'" + req.body.right500 + "'," + "'" + req.body.right1000 + "'," + "'" + req.body.right2000 + "'," + "'" + req.body.left500 + "'," + "'" + req.body.left1000 + "'," + "'" + req.body.left2000 + "')",
    function(err, rows) {
      connection.release();
    });
    //connection.end();
  });

  res.redirect('/landing/' + sessionId)

};

module.exports.hearing = hearing;
module.exports.hearingPost = hearingPost;