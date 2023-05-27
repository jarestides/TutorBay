import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';

function VerifyEmail()
{
    var storage = require('../tokenStorage.js');
    var loginUserName;
    var loginPassword;
    const [message,setMessage] = useState('');

    const doVerifyEmail = async event => 
    {
	    event.preventDefault();
        
        var obj = {login:loginUserName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        
        try
        {    
            const response = await fetch('https://tutorbay.herokuapp.com/api/verifyEmail',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            if( res.error === "Update failed" )
            {
                setMessage('Username/Password combination incorrect');
            }
            else
            {
                //var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                //localStorage.setItem('user_data', JSON.stringify(user));
                
                setMessage('Your email has been verified!');
                const response2 = await fetch('https://tutorbay.herokuapp.com/api/login', {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
                var res2 = JSON.parse(await response2.text());
                storage.storeToken(res2);
                var jwt = require('jsonwebtoken');

                var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                var userId = ud.payload.userId;
                var firstName = ud.payload.firstName;
                var lastName = ud.payload.lastName;
                  
                var user = {firstName:firstName,lastName:lastName,id:userId}
                localStorage.setItem('user_data', JSON.stringify(user));
                setTimeout(() => {
                    window.location.href = '/home';
                  },5000);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    

    };    


    return(
    //     <div>  
    //     <Form className="loginform">
    //         <h3 className="loginlabel">
    //             Log in to Verify Email
    //         </h3>
    //         <Form.Group controlId="formBasicEmail">
    //             <Form.Control className="login-input" type="email" placeholder="username" ref={(c) => loginUserName = c}/>
    //         </Form.Group>
    //         <Form.Group controlId="formBasicPassword">
    //             <Form.Control className="login-input" type="password" placeholder="password" ref={(c) => loginPassword = c}/>
    //         </Form.Group>
    //         <Button size="lg" variant="primary" type="submit" onClick={doVerifyEmail} block>
    //             Verify
    //         </Button>
            
    //         <hr></hr>
    //         <div className="col text-center">
    //         <span id="loginResult">{message}</span>
    //         </div>
            
    //     </Form>
    // </div>

    <div id="verifyDiv">
            <span id="inner-title">LOG IN TO VERIFY EMAIL</span><br />
            <input type="text" id="loginUserName" placeholder="Username" ref={(c) => loginUserName = c}  /><br/>
            <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} /><br />
            <input type="submit" id="loginButton" class="buttons" value = "submit" onClick={doVerifyEmail} /> <br/><br/>
            <span id="verifyResult">{message}</span>
        </div>
   );
};

export default VerifyEmail;