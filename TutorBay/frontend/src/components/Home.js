import React from 'react';
function Home()
{
    var data = JSON.parse(localStorage.getItem('user_data'));
    const doLogin = async event => 
    {
        event.preventDefault();
        alert('doIt()');
    };
    return(
      <div id="loginDiv">
        <form onSubmit={doLogin}>
        <span id="inner-title">Welcome, {data.firstName} {data.lastName}. Please access the mobile app to continue.</span><br />
        </form>
        <span id="loginResult"></span>
     </div>
    );
};
export default Home;