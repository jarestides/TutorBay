import React from 'react';
import { Figure } from 'react-bootstrap';
import logo from '../images/Logo.png';

function PageTitle()
{
   return(
      <div className="title">
        <br></br>
        <Figure className="imageAlign">
            <Figure.Image
                width={70}
                height={70}
                alt="<image>"
                src={logo}
            />
        </Figure>
      </div>
   );
};

export default PageTitle;