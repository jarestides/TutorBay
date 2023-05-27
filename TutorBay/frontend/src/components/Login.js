import { useState, useRef } from "react";

import axios from "axios";

export const Login = () => {

    var storage = require('../tokenStorage.js');
    var loginName;
    var loginPassword;
    const [message,setMessage] = useState('');

    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {login: loginName.value, password: loginPassword.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch('https://tutorbay.herokuapp.com/api/login', {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            if( res.error === "Not yet verified" )
            {
                setMessage('Check your email to verify account');
            }
            else if( typeof res.fn == 'undefined' )
            {
                setMessage('Username/Password combination incorrect');
            }
            else
            {
                storage.storeToken(res);
                var jwt = require('jsonwebtoken');

                var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                var userId = ud.payload.userId;
                var firstName = ud.payload.firstName;
                var lastName = ud.payload.lastName;
                  
                var user = {firstName:firstName,lastName:lastName,id:userId}
                localStorage.setItem('user_data', JSON.stringify(user));
                window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    return(
        <div id="loginDiv">
            <span id="inner-title">LOG IN</span><br />
            <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c}  /><br/>
            <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} /><br />
            <input type="submit" id="loginButton" class="buttons" value = "submit" onClick={doLogin} /><br/><br/>
            <span id="loginResult">{message}</span>
            
            <div className="col text-center">
                <a style={{color: 'white'}}href="/forgotpassword"> <br/>Forgot Password?</a><br></br>
                <a style={{color: 'white'}}href="/signup" className="link">Create an account</a>
            </div>
            
        </div>
    );
};
export default Login;