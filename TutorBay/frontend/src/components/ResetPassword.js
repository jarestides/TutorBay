import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function ResetPassword()
{
    var password;
    var confirmPass;
    const [message,setMessage] = useState('');
    const queryString = window.location.search;
    //console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    var token = urlParams.get('token');

    const doResetPassword = async event => 
    {
      
        event.preventDefault();
        var flag = 0;
        var error = [];

        if (password.value === "" ||confirmPass.value === "") {
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
        
        var obj = {token: token, password: password.value};
        console.log(token);
        var js = JSON.stringify(obj);
        try
        {    
            const response = await fetch('https://tutorbay.herokuapp.com/api/resetPassword',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error === "Update failed" )
            {
                setMessage(res.error);
            }
            else
            {
                setMessage("Password Reset");
                setTimeout(() => {
                    window.location.href = '/';
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
    //              Reset Your Password
    //         </h3>
    //         <Form.Group controlId="formBasicPassword">
    //             <Form.Control className="login-input" type="password" placeholder="Enter new password" ref={(c) => password = c}/>
    //         </Form.Group>
    //         <Form.Group controlId="formBasicPassword">
    //             <Form.Control className="login-input" type="password" placeholder="Re-enter password" ref={(c) => confirmPass = c}/>
    //         </Form.Group>
    //         <Button size="lg" variant="primary" type="submit" onClick={doResetPassword} block>
    //             Verify
    //         </Button>
    //         <span id="loginResult">{message}</span>
    //         <hr></hr>
    //     </Form>
    // </div>

    <div id="resetpasswordDiv"> <br/><br/>
    <span id="inner-title">RESET YOUR PASSWORD</span><br />
    <input type="password" id="password" placeholder="Password" ref={(c) => password = c}  /><br/>
    <input type="password" id="confirmPass" placeholder="Confirm Password" ref={(c) => confirmPass = c} /><br />
    <input type="submit" id="loginButton" class="buttons" value = "submit" onClick={doResetPassword} />
    <span id="resetpasswordResult">{message}</span>
</div>
   );
};

export default ResetPassword;