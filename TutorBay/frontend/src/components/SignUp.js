import React, { useState } from 'react';
import { Form,Button } from 'react-bootstrap';

function SignUp()
{
    var firstName;
    var lastName;
    var email;
    var userName;
    var password;
    var confirmPass;

    const [message,setMessage] = useState('');

    const doSignUp = async event => 
    {
        event.preventDefault();

        var flag = 0;
        var error = [];

        if (firstName.value === "" || lastName.value === "" || email.value === "" || password.value === "" || confirmPass.value === "") {
            flag = 1;
            error.push("Please fill out all fields\n");
        }

        if (flag === 1)
        {
            setMessage(error);
            return;
        }
        
        if(password.value !== confirmPass.value)
        {
            error.push("Password does not match\n");
            setMessage(error);
            return;
        }
        var obj = {firstname:firstName.value, lastname:lastName.value, email:email.value, login:userName.value, password:password.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch('https://tutorbay.herokuapp.com/api/register',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error === "" )
            {
                setMessage("Account Created. \nCheck your email for verification link");
                setTimeout(() => {
                    window.location.href = '/';
                  },5000);
            }
            else
            {
                setMessage(res.error);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    return(
    <div id="signupDiv">
        <span id="inner-title">SIGN UP</span><br />
        <input type="text" id="firstName" placeholder="First Name" ref={(c) => firstName = c}  /><br/>
        <input type="text" id="lastName" placeholder="Last Name" ref={(c) => lastName = c}  /><br/>
        <input type="email" id="email" placeholder="Email" ref={(c) => email = c}  /><br/>
        <input type="text" id="userName" placeholder="Username" ref={(c) => userName = c}  /><br/>
        <input type="password" id="password" placeholder="Password" ref={(c) => password = c} /><br />
        <input type="password" id="confirmPass" placeholder="Confirm Password" ref={(c) => confirmPass = c} /><br />
        <input type="submit" id="signupButton" class="buttons" value = "submit" onClick={doSignUp} /> <br/><br/>
        <span id="signupResult">{message}</span>
    </div>
    );
};

export default SignUp;