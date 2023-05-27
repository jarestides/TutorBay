import React, { useState } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function ForgotPassword(props)
{
    var emailForm;

    const [message,setMessage] = useState('');

    const doSendEmail = async event => 
    {
        event.preventDefault();
        
        var obj = {email:emailForm.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch('https://tutorbay.herokuapp.com/api/forgotPassword', {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            let res = JSON.parse(await response.text());
            if(res.error === "Email Sent")
            {
                setMessage("Email has been sent")
            }
            else if (res.error === "Incorect Email")
            {
                setMessage("You must enter a valid email address");
            }
            else
            {
                setMessage(res.error);
            }

        }
        catch(e)
        {
            setMessage("An unexpected error occurred while sending the password reset email. Please try again.");
            return;
        }    
    };



    return(
        // <div>
        //     <form className="login-form" onSubmit={doSendEmail}>
        //     <div className="login-title-container">
        //         <FontAwesomeIcon onClick={() => backToLogin()} className="login-navigate-btn" icon={solid('arrow-left')} />
        //         <span className="login-title">Forgot Password</span>
        //     </div>
        //     <div className="login-forgot-msg">Enter your email address and we will attempt to send you a password reset link.</div>
        //     <div className="login-input-container">
        //         <div className="login-input-header">Email</div>
        //         <input type="text" onChange={(e) => {handleChange(e)}} ref={(c) => emailForm = c} />
        //     </div>
        //     <input type="submit" disabled={disabled} className="login-login-btn btn btn-success" value="Send Email" onClick={doSendEmail} />
        //     </form>
        //     <div className="login-error-msg">{message}</div>
        // </div>

        <div id="forgotpasswordDiv">
            <span id="inner-title">ENTER EMAIL TO RESET PASSWORD</span><br />
            <input type="text" id="emailForm" placeholder="Email" ref={(c) => emailForm = c}  /><br/>
            <input type="submit" id="forgotpasswordButton" class="buttons" value = "submit" onClick={doSendEmail} /> <br/><br/>
            <span id="forgotpasswordResult">{message}</span>
        </div>


    );
};

export default ForgotPassword;