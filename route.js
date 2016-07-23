var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Model = require('./model');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hollie12123',
  database: 'dbUsers'
});

connection.connect(function(err) {
  if (!err) {
    console.log("Database is connected ... \n\n");
  } else {
    console.log("Error connecting database ... \n\n");
  }
});

//-----------------------------------------------------------------------


//--------------------------------------------------------------------


//var GUIDText = "Current Patient ID: ";

function GUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

var sessionId = GUID();

//var GUIDReady = GUIDText + GUID();

//-----------------------------------------------------

var index = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('index', {
      title: 'Home',
      user: user
    });
  }
};


//-------------------------------------------------------
var demographics = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;
    var userId = req.user.attributes.userId

    if (user !== undefined) {
      user = user.toJSON();
    }

    res.render('demographics', {
      title: 'Demographics',
      user: user,
      userId: userId
    });

    // res.download('watch9.pdf');
  }
};
//------------------------------------------------------
var demographicsPost = function(req, res, next) {

  var user = req.user;
  var phone = req.body.phone1 + req.body.phone2 + req.body.phone3;

  //console.log(user.attributes.username);

  connection.query('INSERT INTO persons2 (userId, username, sessionId, lastname, firstname, middlename, dob, age, streetaddress, city, state, zip, dln, issuing, phone, gender, email, holder, verified, denied) VALUES(' + '"' + user.attributes.userId + '",' + '"' + user.attributes.username + '",' + '"' + sessionId + '",' + "'" + req.body.lastname + "'," + "'" + req.body.firstname + "'," + "'" + req.body.middlename + "'," + "'" + req.body.dob + "'," + "'" + req.body.age + "'," + "'" + req.body.streetaddress + "'," + "'" + req.body.city + "'," + "'" + req.body.state + "'," + "'" + req.body.zip + "'," + "'" + req.body.dln + "'," + "'" + req.body.issuing + "'," + "'" + phone + "'," + "'" + req.body.gender + "'," + "'" + req.body.email + "'," + "'" + req.body.holder + "'," + "'" + req.body.verified + "'," + "'" + req.body.denied + "')"),
  function(err,rows) {

}

console.log(phone)
//console.log(res.body.lastname)
  res.redirect('/history');

  (req, res, next);
};

//-------------------------------------------------------
var history = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    if (user !== undefined) {
      user = user.toJSON();
    }

    var user = req.user;

    res.render('history', {
      title: 'History',
      user: user,
      sessionId: sessionId
    });
  }
};

//-------------------------------------------------------

var historyPost = function(req, res, next) {

  var user = req.user;

  console.log(sessionId)

  connection.query('INSERT INTO history (userId, username, sessionId, brainInjuries, seizures, eyeProblems, earProblems, heartProblems, paceMaker, highBloodPressure, highCholesterol, breathingProblems, lungDisease, kidneyProblems, stomachProblems, diabetes, anxiety, fainting, dizziness, unexplainedWeightLoss, stroke, missingLimbs, backProblems,  boneProblems, bloodClots, cancer, chronicDiseases, sleepDisorders, sleepTest, nightInHospital, brokenBone, useTobacco, drinkAlcohol, illegalSubstance, failedDrugTest) VALUES (' + "'" + user.attributes.userId + "'," + "'" + user.attributes.username + "'," + "'" + sessionId + "'," + "'" + req.body.brainInjuries + "'," + "'" + req.body.seizures + "'," + "'" + req.body.eyeProblems + "'," + "'" + req.body.earProblems + "'," + "'" + req.body.heartProblems + "'," + "'" + req.body.paceMaker + "'," + "'" + req.body.highBloodPressure + "'," + "'" + req.body.highCholesterol + "'," + "'" + req.body.breathingProblems + "'," + "'" + req.body.lungDisease + "'," + "'" + req.body.kidneyProblems + "'," + "'" + req.body.stomachProblems + "'," + "'" + req.body.diabetes + "'," + "'" + req.body.anxiety + "'," + "'" + req.body.fainting + "'," + "'" + req.body.dizziness + "'," + "'" + req.body.unexplainedWeightLoss + "'," + "'" + req.body.stroke + "'," + "'" + req.body.missingLimbs + "'," + "'" + req.body.backProblems + "'," + "'" + req.body.boneProblems + "'," + "'" + req.body.bloodClots + "'," + "'" + req.body.cancer + "'," + "'" + req.body.chronicDiseases + "'," + "'" + req.body.sleepDisorders + "'," + "'" + req.body.sleepTest + "'," + "'" + req.body.nightInHospital + "'," + "'" + req.body.brokenBone + "'," + "'" + req.body.useTobacco + "'," + "'" + req.body.drinkAlcohol + "'," + "'" + req.body.illegalSubstance + "'," + "'" + req.body.failedDrugTest + "')"),
    function(err, rows) {};

  res.redirect('/historyreview')
};

//-------------------------------------------------------

var home = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;
    var arr =[];
    var arr2 = [];

    if (user !== undefined) {
      user = user.toJSON();
    }


      connection.query("SELECT * FROM history WHERE history.sessionId =" +  '"' + sessionId + '"',
        function(err, rows) {

          var obj = rows[0];

          for (var prop in obj) {
            if(obj[prop] == "yes") {
              arr.push("yes");
            }
            else {
              arr.push("no")
            }
          }

          for (i=4; i<arr.length; i++) {
            arr2.push(arr[i])
          }


    res.render('home', {
      title: 'Home',
      user: user,
      arr: arr2

    });










      });



    // res.render('home', {
    //   title: 'Home',
    //   user: user,
    //   rows: rows[0]
    // });
  }
};

//-------------------------------------------------------
var historyReview = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('historyreview', {
      title: 'History Review',
      user: user
    });
  }
};

//-------------------------------------------------------
var historyReviewPost = function(req, res, next) {

  var user = req.user;

  connection.query('INSERT INTO history_review(username, userId, sessionId, historyReview)VALUES(' + "'" + user.attributes.userId + "'," + "'" + user.attributes.username + "'," + "'" + sessionId + "'," + "'" + req.body.review + "')"),
    function(err, rows) {}

  res.redirect('/testing')
};

//-------------------------------------------------------
var testing = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('testing', {
      title: 'Testing',
      user: user
    });
  }
};

//-------------------------------------------------------
var testingPost = function(req, res, next) {

  var user = req.user;

  connection.query('INSERT INTO testing(username, userId, sessionId, pulseRate, rhythm, bloodPressure1, bloodPressure2, systolic, diastolic, sitting, secondReading, otherTesting) VALUES(' + "'" + user.attributes.username + "'," + "'" + user.attributes.userId + "'," + "'" + sessionId + "'," + "'" + req.body.pulserate + "'," + "'" + req.body.rhythm + "'," + "'" + req.body.bloodpressure1 + "'," + "'" + req.body.bloodpressure1 + "'," + "'" + req.body.systolic + "'," + "'" + req.body.diastolic + "'," + "'" + req.body.sitting + "'," + "'" + req.body.secondreading + "'," + "'" + req.body.othertesting + "')"),
    function(err, rows) {

    }

  // console.log(req.body.pulserate)
  // console.log(req.body.rhythm)
  // console.log(req.body.bloodpressure1)
  // console.log(req.body.bloodpressure2)
  // console.log(req.body.systolic)
  // console.log(req.body.diastolic)
  // console.log(req.body.sitting)
  // console.log(req.body.secondreading)
  // console.log(req.body.othertesting)

  res.redirect('/vision')
};

//-------------------------------------------------------
var vision = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('vision', {
      title: 'Vision',
      user: user
    });
  }
};
//-------------------------------------------------------
var visionPost = function(req, res, next) {

  var user = req.user;

  connection.query('INSERT INTO vision(username, userId, sessionId, rightuncorrected, rightcorrected, fieldright, leftuncorrected, leftcorrected, fieldleft, bothuncorrected, bothcorrected) VALUES(' + "'" + user.attributes.username + "'," + "'" + user.attributes.userId + "'," + "'" + sessionId + "'," + "'" + req.body.rightuncorrected + "'," + "'" + req.body.rightcorrected + "'," + "'" + req.body.fieldright + "'," + "'" + req.body.leftuncorrected + "'," + "'" + req.body.leftcorrected + "'," + "'" + req.body.fieldleft + "'," + "'" + req.body.bothuncorrected + "'," + "'" + req.body.bothcorrected + "')"),
    function(err, rows) {

    }

  // console.log(req.body.rightuncorrected)
  // console.log(req.body.rightcorrected)
  // console.log(req.body.fieldright)
  // console.log(req.body.leftuncorrected)
  // console.log(req.body.leftcorrected)
  // console.log(req.body.fieldleft)
  // console.log(req.body.bothuncorrected)
  // console.log(req.body.bothcorrected)

  if (req.body.rightuncorrected >= 40) {
    res.redirect('/warn')
  } else {
    res.redirect('/hearing')
  }
};

//-------------------------------------------------------
var hearing = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

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

  connection.query('INSERT INTO hearing(username, userId, sessionId, hearingaidright, hearingaidleft, hearingaidboth, rightear, leftear, right500, right1000, right2000, left500, left1000, left2000) VALUES(' + "'" + user.attributes.username + "'," + "'" + user.attributes.userId + "'," + "'" + sessionId + "'," + "'" + req.body.hearingaidright + "'," + "'" + req.body.hearingaidleft + "'," + "'" + req.body.hearingaidboth + "'," + "'" + req.body.rightear + "'," + "'" + req.body.leftear + "'," + "'" + req.body.right500 + "'," + "'" + req.body.right1000 + "'," + "'" + req.body.right2000 + "'," + "'" + req.body.left500 + "'," + "'" + req.body.left1000 + "'," + "'" + req.body.left2000 + "')"),
    function(err, rows) {

    }

  // console.log(req.body.hearingaidright)
  // console.log(req.body.hearingaidleft)
  // console.log(req.body.hearingaidboth)
  // console.log(req.body.rightear)
  // console.log(req.body.leftear)
  // console.log(req.body.right500)
  // console.log(req.body.right1000)
  // console.log(req.body.right2000)
  // console.log(req.body.left500)
  // console.log(req.body.left1000)
  // console.log(req.body.left2000)

  if (req.body.rightear >= 5 || req.body.leftear >= 5) {
    res.redirect('/physicalexamination')
  } else {
    res.redirect('/warn')
  }

};

//-------------------------------------------------------
var physicalExamination = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('physicalexamination', {
      title: 'Physical examination',
      user: user
    });
  }
};
//-------------------------------------------------------
var physicalExaminationPost = function(req, res, next) {

  var user = req.user;

  // console.log(req.body.general)
  // console.log(req.body.skin)
  // console.log(req.body.eyes)
  // console.log(req.body.ears)
  // console.log(req.body.mouth)
  // console.log(req.body.cardiovascular)
  // console.log(req.body.lungs)
  // console.log(req.body.abdomen)
  // console.log(req.body.hernias)
  // console.log(req.body.back)
  // console.log(req.body.joints)
  // console.log(req.body.neuro)
  // console.log(req.body.gait)
  // console.log(req.body.vascular)
  //console.log(req.body.textarea)

    connection.query('INSERT INTO physicalexam(username, userId, sessionId, general, skin, eyes, mouth, cardiovascular, lungs, abdomen, back, joints, neuro, gait, vascular, textarea) VALUES(' + "'" + user.attributes.username + "'," + "'" + user.attributes.userId + "'," + "'" + sessionId + "'," + "'" + req.body.general + "'," + "'" + req.body.skin + "'," + "'" + req.body.eyes + "'," + "'" + req.body.mouth + "'," + "'" + req.body.cardiovascular + "'," + "'" + req.body.lungs + "'," + "'" + req.body.abdomen + "'," + "'" + req.body.back + "'," + "'" + req.body.joints + "'," + "'" + req.body.neuro + "'," + "'" + req.body.gait + "'," + "'" + req.body.vascular + "'," + "'" + req.body.textarea + "')"),
    function(err, rows) {

    }



  res.redirect('/end')
};
//-------------------------------------------------------
var end = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    var datas = connection.query('SELECT persons2.*, history.*, history_review.*, testing.*, vision.*, hearing.*, physicalexam.* FROM persons2, history, history_review, testing, vision, hearing, physicalexam WHERE' + "'" + sessionId + "'" + '=persons2.sessionId AND' + "'" + sessionId + "'" + '=history.sessionId AND' + "'" + sessionId + "'" + '=history_review.sessionId AND' + "'" + sessionId + "'" + '=testing.sessionId AND' + "'" + sessionId + "'" + '=vision.sessionId AND' + "'" + sessionId + "'" + '=hearing.sessionId AND' + "'" + sessionId + "'" + '=physicalexam.sessionId' , function(err, rows) {


      console.log("rows[0].lastname: " + rows[0].lastname)
      console.log("rows[0].firstname: " + rows[0].firstname)
      console.log("rows[0].middlename: " + rows[0].middlename)
      console.log("rows[0].dob: " + rows[0].dob)
      console.log("rows[0].leftcorrected: " + rows[0].leftcorrected)
      console.log("rows[0].rightear: " + rows[0].rightear)
      console.log("rows[0].mouth: " + rows[0].mouth)
      console.log("rows[0].lungs: " + rows[0].lungs)
      //return rows[0];

var fs = require('fs');
var pdfFiller   = require('pdffiller');

var sourcePDF = "newFormSpecial.pdf";
// var destinationPDF =  "../../Desktop/watch8.pdf";
var destinationPDF =  "watch9.pdf";
var shouldFlatten = true;


//brainInjuries, seizures, eyeProblems, earProblems, heartProblems, paceMaker, highBloodPressure, highCholesterol, breathingProblems, lungDisease, kidneyProblems, stomachProblems, diabetes, anxiety, fainting, dizziness, unexplainedWeightLoss, stroke, missingLimbs, backProblems,  boneProblems, bloodClots, cancer, chronicDiseases, sleepDisorders, sleepTest, nightInHospital, brokenBone, useTobacco, drinkAlcohol, illegalSubstance, failedDrugTest)


var data = {
"MCSA-5875[0].Page1[0].privacyStatement[0].privacyDate[0]": "rows[0].",
"MCSA-5875[0].Page1[0].medRecord[0].medNumber[0]": "rows[0].",
"MCSA-5875[0].Page1[0].driverPersonal[0].nameLast[0]": rows[0].lastname,
"MCSA-5875[0].Page1[0].driverPersonal[0].nameFirst[0]": rows[0].firstname,
"MCSA-5875[0].Page1[0].driverPersonal[0].nameInitial[0]": rows[0].middlename,
"MCSA-5875[0].Page1[0].driverPersonal[0].birthDate[0]": rows[0].dob,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverAge[0]": rows[0].age,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverAddress[0]": rows[0].streetaddress,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverCity[0]": rows[0].city,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverState[0]": rows[0].state,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverZip[0]": rows[0].zip,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverLicense[0]": rows[0].dln,
"MCSA-5875[0].Page1[0].driverPersonal[0].licenseState[0]": rows[0].issuing,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverPhone[0]": rows[0].phone,
"MCSA-5875[0].Page1[0].driverPersonal[0].genderGroup[0].genderButtons[0]": rows[0].gender,
"MCSA-5875[0].Page1[0].driverPersonal[0].emailAddress[0]": rows[0].email,
"MCSA-5875[0].Page1[0].driverPersonal[0].cdlLicense[0].cdlButtonList[0]": rows[0].holder,
"MCSA-5875[0].Page1[0].driverPersonal[0].driverVerify[0]": rows[0].verified,
"MCSA-5875[0].Page1[0].driverPersonal[0].certDenyGroup[0].certDenyButtons[0]": rows[0].denied,
"MCSA-5875[0].Page1[0].surgeryGroup[0].surgeryButtons[0]": "rows[0].",
"MCSA-5875[0].Page1[0].surgeryGroup[0].surgeryDescribe[0]": "rows[0].",
"MCSA-5875[0].Page1[0].medicineGroup[0].medicineButtons[0]": "rows[0].",
"MCSA-5875[0].Page1[0].medicineGroup[0].medicineDescribe[0]": "rows[0].",
"MCSA-5875[0].Page1[0].attachButton[0]": "rows[0].",
"MCSA-5875[0].Page2[0].pageHead2[0].nameLastHead2[0]": rows[0].lastname,
"MCSA-5875[0].Page2[0].pageHead2[0].nameFirstHead2[0]": rows[0].firstname,
"MCSA-5875[0].Page2[0].pageHead2[0].nameInitialHead2[0]": rows[0].middlename,
"MCSA-5875[0].Page2[0].pageHead2[0].dateBirth2[0]": rows[0].dob,
"MCSA-5875[0].Page2[0].pageHead2[0].dateForm2[0]": "rows[0].",
"MCSA-5875[0].Page2[0].driverHealth[0].headGroup[0].headButtons[0]": rows[0].brainInjuries,
"MCSA-5875[0].Page2[0].driverHealth[0].seizeGroup[0].seizeButtons[0]": rows[0].seizures,
"MCSA-5875[0].Page2[0].driverHealth[0].eyeGroup[0].eyeButtons[0]": rows[0].eyeProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].earGroup[0].earButtons[0]": rows[0].earProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].heartGroup[0].heartButtons[0]": rows[0].heartProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].paceGroup[0].paceButtons[0]": rows[0].paceMaker,
"MCSA-5875[0].Page2[0].driverHealth[0].highGroup[0].highButtons[0]": rows[0].highBloodPressure,
"MCSA-5875[0].Page2[0].driverHealth[0].cholesterolGroup[0].cholesterolButtons[0]": rows[0].highCholesterol,
"MCSA-5875[0].Page2[0].driverHealth[0].breathGroup[0].breathButtons[0]": rows[0].breathingProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].lungGroup[0].lungButtons[0]": rows[0].lungDisease,
"MCSA-5875[0].Page2[0].driverHealth[0].kidneyGroup[0].kidneyButtons[0]": rows[0].kidneyProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].stomachGroup[0].stomachButtons[0]": rows[0].stomachProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].sugarGroup[0].sugarButtons[0]": rows[0].diabetes,
"MCSA-5875[0].Page2[0].driverHealth[0].insulinGroup[0].insulinButtons[0]": "rows[0].",
"MCSA-5875[0].Page2[0].driverHealth[0].mentalGroup[0].mentalButtons[0]": rows[0].anxiety,
"MCSA-5875[0].Page2[0].driverHealth[0].faintGroup[0].faintButtons[0]": rows[0].fainting,
"MCSA-5875[0].Page2[0].driverHealth[0].dizzyGroup[0].dizzyButtons[0]": rows[0].dizziness,
"MCSA-5875[0].Page2[0].driverHealth[0].weightGroup[0].weightButtons[0]": rows[0].unexplainedWeightLoss,
"MCSA-5875[0].Page2[0].driverHealth[0].strokeGroup[0].strokeButtons[0]": rows[0].stroke,
"MCSA-5875[0].Page2[0].driverHealth[0].uselimitGroup[0].uselimitButtons[0]": rows[0].missingLimbs,
"MCSA-5875[0].Page2[0].driverHealth[0].neckbackGroup[0].neckbackButtons[0]": rows[0].backProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].boneGroup[0].boneButtons[0]": rows[0].boneProblems,
"MCSA-5875[0].Page2[0].driverHealth[0].bloodGroup[0].bloodButtons[0]": rows[0].bloodClots,
"MCSA-5875[0].Page2[0].driverHealth[0].cancerGroup[0].cancerButtons[0]": rows[0].cancer,
"MCSA-5875[0].Page2[0].driverHealth[0].infectGroup[0].infectButtons[0]": rows[0].chronicDiseases,
"MCSA-5875[0].Page2[0].driverHealth[0].apneaGroup[0].apneaButtons[0]": rows[0].sleepDisorders,
"MCSA-5875[0].Page2[0].driverHealth[0].sleeptestGroup[0].sleeptestButtons[0]": rows[0].sleepTest,
"MCSA-5875[0].Page2[0].driverHealth[0].hospitalGroup[0].hospitalButtons[0]": rows[0].nightInHospital,
"MCSA-5875[0].Page2[0].driverHealth[0].brokenGroup[0].brokenButtons[0]": rows[0].brokenBone,
"MCSA-5875[0].Page2[0].driverHealth[0].tobaccoGroup[0].tobaccoButtons[0]": rows[0].useTobacco,
"MCSA-5875[0].Page2[0].driverHealth[0].alcoholGroup[0].alcoholButtons[0]": rows[0].drinkAlcohol,
"MCSA-5875[0].Page2[0].driverHealth[0].illegalGroup[0].illegalButtons[0]": rows[0].illegalSubstance,
"MCSA-5875[0].Page2[0].driverHealth[0].failedGroup[0].failedButtons[0]": rows[0].failedDrugTest,
"MCSA-5875[0].Page2[0].otherGroup[0].otherButtons[0]": "rows[0].",
"MCSA-5875[0].Page2[0].otherGroup[0].otherDescribe[0]": "rows[0].",
"MCSA-5875[0].Page2[0].commentGroup[0].commentButtons[0]": "rows[0].",
"MCSA-5875[0].Page2[0].commentGroup[0].commentDescribe[0]": "rows[0].",
"MCSA-5875[0].Page2[0].attachButton[0]": "rows[0].",
"MCSA-5875[0].Page2[0].driverSignature[0].signatureDate[0]": "rows[0].",
"MCSA-5875[0].Page2[0].#area[2].driveReview[0].examinerComment[0]": "rows[0].",
"MCSA-5875[0].Page2[0].#area[2].driveReview[0].attachButton2[0]": "rows[0].",
"MCSA-5875[0].Page3[0].pageHead3[0].nameLastHead3[0]": rows[0].lastname,
"MCSA-5875[0].Page3[0].pageHead3[0].nameFirstHead3[0]": rows[0].firstname,
"MCSA-5875[0].Page3[0].pageHead3[0].nameInitialHead3[0]": rows[0].middlename,
"MCSA-5875[0].Page3[0].pageHead3[0].dateBirth3[0]": rows[0].dob,
"MCSA-5875[0].Page3[0].pageHead3[0].dateForm3[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].basicStats[0].pulseMeasure[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].basicStats[0].pulserhythmGroup[0].pulserhythmButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].basicStats[0].#area[1].feetHeight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].basicStats[0].#area[1].inchesHeight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].basicStats[0].#area[1].poundsWeight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].bloodPressure[0].Row1[0].sitSys[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].bloodPressure[0].Row1[0].sitDias[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].bloodPressure[0].Row2[0].secSys[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].bloodPressure[0].Row2[0].secDias[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].otherTesting[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].urineTest[0].urineAnalysis[0].Row1[0].spgrNumber[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].urineTest[0].urineAnalysis[0].Row1[0].proteinNumber[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].urineTest[0].urineAnalysis[0].Row1[0].bloodNumber[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].urineTest[0].urineAnalysis[0].Row1[0].sugarNumber[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].uncorrectRight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].correctRight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].fieldRight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].uncorrectLeft[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].correctLeft[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].fieldLeft[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].uncorrectBoth[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].correctBoth[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].distinguishGroup[0].distinguishButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].monocularGroup[0].monocularButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].referredGroup[0].referredButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].visionTest[0].documentGroup[0].documentButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].hearingaidGroup[0].hearingaidButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].whisperRight[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].whisperLeft[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].right500[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].right1000[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].right2000[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].left500[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].left1000[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].left2000[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].rightAverage[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveTest[0].hearingTest[0].#area[0].#area[2].leftAverage[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].generalButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].skinButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].eyesButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].earsButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].mouthButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].heartButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys1[0].chestButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].abdomenButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].herniaButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].backButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].jointsButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].neuroButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].gaitButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].bodysys2[0].vascularButtons[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].examComment[0]": "rows[0].",
"MCSA-5875[0].Page3[0].driveExam[0].attachButton3[0]": "rows[0].",
"MCSA-5875[0].Page4[0].pageHead4[0].nameLastHead4[0]": rows[0].lastname,
"MCSA-5875[0].Page4[0].pageHead4[0].nameFirstHead4[0]": rows[0].firstname,
"MCSA-5875[0].Page4[0].pageHead4[0].nameInitialHead4[0]": rows[0].middlename,
"MCSA-5875[0].Page4[0].pageHead4[0].dateBirth4[0]": rows[0].dob,
"MCSA-5875[0].Page4[0].pageHead4[0].dateForm4[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].standardButtonList[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].notStandardsWhy[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].butStandardsWhy[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].qualifiedButtonList[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].otherQualify[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].correctLenses[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].hearingAid[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].waiverQualify[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].waiverEnter[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].speQualify[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].cfrQualify[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].exemptQualify[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].incompleteButtonList[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].pendingWhy[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].returnExam[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].returnDate[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].reportAmend[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].amendWhy[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].ifAmendDate[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].incompleteWhy[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].examName[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].medicalAddress[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].medicalCity[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].medicalState[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].medicalZip[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].medicalPhone[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].examDate[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].certNumber[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].issueState[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].md[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].do[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].physAssist[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].chiroPractor[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].pracNurse[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].otherPrac[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].nationalRegister[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].expireDate[0]": "rows[0].",
"MCSA-5875[0].Page4[0].fedDetermination[0].otherPracSpecify[0]": "rows[0].",
"MCSA-5875[0].Page5[0].pageHead5[0].nameLastHead5[0]": rows[0].lastname,
"MCSA-5875[0].Page5[0].pageHead5[0].nameFirstHead5[0]": rows[0].firstname,
"MCSA-5875[0].Page5[0].pageHead5[0].nameInitialHead5[0]": rows[0].middlename,
"MCSA-5875[0].Page5[0].pageHead5[0].dateBirth5[0]": rows[0].dob,
"MCSA-5875[0].Page5[0].pageHead5[0].dateForm5[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].standardButtonListState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].notStandardsWhyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].butStandardsWhyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].qualifiedButtonListState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].otherQualifyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].correctLensesState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].hearingAidState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].waiverQualifyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].waiverEnterState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].speQualifyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].grandQualifyState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].examNameState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].examDateState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].medicalAddressState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].medicalCityState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].medicalStateState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].medicalZipState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].medicalPhoneState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].certNumberState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].issueStateState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].mdState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].doState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].physAssistState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].chiroPractorState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].pracNurseState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].otherPracState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].otherSpec[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].nationalRegisterState[0]": "rows[0].",
"MCSA-5875[0].Page5[0].stateDetermination[0].expireDateState[0]": "rows[0]."

};

pdfFiller.fillForm( sourcePDF, destinationPDF, data, shouldFlatten, function(err) {
    if (err) throw err;
    console.log("In callback (we're done).");
});




    });




    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('end', {
      title: 'End',
      user: user
    });
  }
};
//-------------------------------------------------------
var endPost = function(req, res, next) {

  var user = req.user;


  res.redirect('/pdf')

};

//-------------------------------------------------------
var pdf = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }

    res.download('watch9.pdf')

    // res.render('pdf', {
    //   title: 'PDF',
    //   user: user
    // });
  }
};
//-------------------------------------------------------
//res.download('watch9.pdf')




//-------------------------------------------------------
var dropdown = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('dropdown', {
      title: 'dropdown',
      user: user
    });
  }
};

//-------------------------------------------------------
var form = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('form', {
      title: 'form',
      user: user
    });
  }
};
//-------------------------------------------------------
var dropdownPost = function(req, res, next) {

  var user = req.user;

  res.redirect('/home')
};

//-------------------------------------------------------
var medication = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('medication', {
      title: 'Medication',
      user: user
    });
  }
};

//-------------------------------------------------------

var signIn = function(req, res, next) {
  if (req.isAuthenticated()) res.redirect('/');
  res.render('signin', {
    title: 'Sign In'
  });

};

//-------------------------------------------------------

var signInPost = function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }, function(err, user, info) {
    if (err) {
      return res.render('signin', {
        title: 'Sign In',
        errorMessage: err.message
      });
    }

    if (!user) {
      return res.render('signin', {
        title: 'Sign In',
        errorMessage: info.message
      });
    }
    return req.logIn(user, function(err) {
      if (err) {
        return res.render('signin', {
          title: 'Sign In',
          errorMessage: err.message
        });
      } else {

        connection.query('INSERT INTO session(username, userId, sessionId)VALUES(' + '"' + user.username + '",' + '"' + user.userId + '",' + '"' + sessionId + '")'),
          function(err, rows) {

          };

        return res.redirect('/demographics');
      }
    });
  })(req, res, next);
};

//-----------------------------------------------------------------------------------

var signUp = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('signup', {
      title: 'Sign Up'
    });
  }
};

//----------------------------------------------------------------------------

var signUpPost = function(req, res, next) {
  var user = req.body;
  var usernamePromise = null;
  usernamePromise = new Model.User({
    username: user.username
  }).fetch();

  return usernamePromise.then(function(model) {
    if (model) {
      res.render('signup', {
        title: 'signup',
        errorMessage: 'username already exists'
      });
    } else {
      //****************************************************//
      // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
      //****************************************************//
      var password = user.password;
      var hash = bcrypt.hashSync(password);

      var signUpUser = new Model.User({
        username: user.username,
        password: hash
      });

      signUpUser.save().then(function(model) {
        // sign in the newly registered user
        signInPost(req, res, next);
      });
    }
  });
};

//-------------------------------------------------------------------------------------------

var signOut = function(req, res, next) {
    // if(!req.isAuthenticated()) {
    //    notFound404(req, res, next);
    // } else {
    req.logout();
    res.redirect('/signin');
  }
  // };

//-------------------------------------------------------

var warn = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('warn', {
      title: 'warn',
      user: user
    });
  }
};

//-------------------------------------------------------

var notFound404 = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {

    var user = req.user;

    if (user !== undefined) {
      user = user.toJSON();
    }
    res.render('404', {
      title: '404',
      user: user
    });
  }
};

//--------------------------------------------------------

module.exports.form = form;
module.exports.index = index;
module.exports.home = home;
module.exports.end = end;
module.exports.endPost = endPost;
module.exports.pdf = pdf;
module.exports.demographics = demographics;
module.exports.demographicsPost = demographicsPost;
module.exports.history = history;
module.exports.historyPost = historyPost;
module.exports.historyReview = historyReview;
module.exports.historyReviewPost = historyReviewPost;
module.exports.testing = testing;
module.exports.testingPost = testingPost;
module.exports.vision = vision;
module.exports.visionPost = visionPost;
module.exports.hearing = hearing;
module.exports.hearingPost = hearingPost;
module.exports.physicalExamination = physicalExamination;
module.exports.physicalExaminationPost = physicalExaminationPost;
module.exports.hearingPost = hearingPost;
module.exports.medication = medication;
module.exports.dropdown = dropdown;
module.exports.dropdownPost = dropdownPost;
module.exports.signIn = signIn;
module.exports.signInPost = signInPost;
module.exports.signUp = signUp;
module.exports.signUpPost = signUpPost;
module.exports.signOut = signOut;
module.exports.warn = warn;
module.exports.notFound404 = notFound404;
