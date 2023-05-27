exports.setApp = function ( app, client )
{
  const Users = require("./models/users.js");
  const Subjects = require("./models/subjects.js");
  const Lessons = require("./models/lessons.js");

  const token = require("./createJWT.js");
  const hashPass = require('password-hash');
  const randtoken = require('rand-token');
  var ObjectId = require('mongodb').ObjectID;

  app.post('/api/searchSubjects', async (req, res, next) => 
  {
    var error = '';
  
    const { search, jwtToken } = req.body;
    try
    {
      if( token.isExpired(jwtToken))
      {
        var r = {error:'The JWT is no longer valid', jwtToken: ''};
        res.status(200).json(r);
        return;
      }
    }
    catch(e)
    {
      console.log(e.message);
    }
    
    var _search = search.trim();
    const results = await Subjects.find({ "Name": { $regex: _search + '.*', $options: 'r' } });
    
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
        _ret.push( { id: results[i]._id, Name: results[i].Name } );
    }
    
    var refreshedToken = null;
    try
    {
      refreshedToken = token.refresh(jwtToken);
    }
    catch(e)
    {
      console.log(e.message);
    }
  
    var ret = { results:_ret, error: error, jwtToken: refreshedToken };
    
    res.status(200).json(ret);
  });

  app.post('/api/searchLessons', async (req, res, next) =>
  {
 
    var error = '';
  
    const { id, jwtToken } = req.body;
    try
    {
      if( token.isExpired(jwtToken))
      {
        var r = {error:'The JWT is no longer valid', jwtToken: ''};
        res.status(200).json(r);
        return;
      }
    }
    catch(e)
    {
      console.log(e.message);
    }
    
    const results = await Lessons.find({ "Subject_id": id });
    
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
        _ret.push( { id: results[i]._id, Title: results[i].Title } );
    }
    
    var refreshedToken = null;
    try
    {
      refreshedToken = token.refresh(jwtToken);
    }
    catch(e)
    {
      console.log(e.message);
    }
  
    var ret = { results:_ret, error: error, jwtToken: refreshedToken };
    
    res.status(200).json(ret);
  });

  app.post('/api/select', async (req, res, next) => 
  {
    var error = '';
    const { id, jwtToken } = req.body;
    try
    {
      if( token.isExpired(jwtToken))
      {
        var r = {error:'The JWT is no longer valid', jwtToken: ''};
        res.status(200).json(r);
        return;
      }
    }
    catch(e)
    {
      console.log(e.message);
    }
    const results = await Lessons.find({ "_id": id });
    var _ret;
    if(results.length > 0)
    {
        _ret = { link: results[0].Link, article: results[0].Article };
    }
    else
    {
        _ret = { error: "Lesson does not exist"};
    }
      
    var refreshedToken = null;
    try
    {
      refreshedToken = token.refresh(jwtToken);
    }
    catch(e)
    {
      console.log(e.message);
    }
      
    var ret = { results: _ret, jwtToken: refreshedToken };
      
    res.status(200).json(ret);
  });

  app.post('/api/login', async (req, res, next) => 
  {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
  
    var error = '';
  
    const { login, password } = req.body;
    const results = await Users.find({ Login: login });

    var id = ObjectId();
    var fn = '';
    var ln = '';
    var ret;
    if(results.length > 0 && hashPass.verify(password, results[0].Password))
    {
      if( results[0].Verify == true )
      {
        id = results[0]._id;
        fn = results[0].FirstName;
        ln = results[0].LastName;
        try
        {
          ret = token.createToken( fn, ln, id );
        }
        catch(e)
        {
          ret = {error:e.message};
        }
      }
      else
      {
        ret = {error:"Not yet verified"};
      }
    }
    else
    {
      ret = {error:"Login/Password incorrect"};
    }

    res.status(200).json(ret);
  });

  app.post('/api/register', async (req, res, next) =>
  {
    var error = '';

    const { firstname, lastname, email, login, password } = req.body;
    var hashedPass = hashPass.generate(password);

    const user = {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        Login: login,
        Password: hashedPass,
        Verify: false
    }

    try {
      await Users.create(user);
      
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
          to: email, // Change to your recipient
          from: 'thetutorbay@gmail.com', // Change to your verified sender
          subject: 'Please Verify Your Email!',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<a href="https://tutorbay.herokuapp.com/verifyemail"<strong><button type="button">Click Me To Verify Account!</button></strong>', //HTML for verification email
      }
      sgMail
          .send(msg)
          .then(() => {
          console.log('Email sent')
          })
          .catch((error) => {
          console.error(error)
          })
    }
    catch(e) {
      error = "Email/Username already in use";
    }

    var ret = { error: error };
    res.status(200).json(ret);
  });

  app.post('/api/verifyEmail', async (req, res, next) =>
  {
    var error = '';
    const { login, password } = req.body;
      
    const results = await Users.find({ Login: login });

    if (results.length > 0 && hashPass.verify(password, results[0].Password))
    {
        var query = { Login: login };

        var newValues = { $set: {Verify : true} };

        try {
            await Users.updateOne(query, newValues);
        }
        catch(e) {
            error = "Update failed";
        }
    }

    var ret = { error: error };

    res.status(200).json(ret);
  });

  app.post('/api/forgotPassword', async (req, res, next) =>
  {
     var error = '';
     const {email} = req.body;

     try
     { 
      const results = await Users.find({ Email: email });
      if (results.length > 0)
      {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        error = "Email Sent";
        var token = randtoken.generate(20);
        var newValues = { $set: {Token : token} };
        await Users.updateOne({ Email: email }, newValues);

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: email, // Change to your recipient
          from: 'thetutorbay@gmail.com', // Change to your verified sender
          subject: 'Reset Your Password!',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<a href="https://tutorbay.herokuapp.com/resetpassword?token=' + token + '"<strong><button type="button">Click Me To Reset Password!</button></strong>',
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error)
          })
      }
      else
      {
        error="Incorrect Email";
      }
      
     }catch(e)
     {
      error = e.toString();
     }
     var ret = { error: error };
     res.status(200).json(ret);
  });

  app.post('/api/resetPassword', async (req, res, next) =>
  {
    var error = '';
 
    const { token, password } = req.body;
    if(token == null)
    {
      error = "Update failed";
    }
    else
    {
      var hashedPass = hashPass.generate(password);
      var query = { Token: token };
       
      var newValues = { $set: {Password: hashedPass} };
        
      try {
          await Users.updateOne(query, newValues);
      }
      catch(e) {
          error = "Update failed";
      }
    }
    // console.log(query);
    // console.log(newValues);
    var ret = { error: error };
      
    res.status(200).json(ret);
  });
    
}