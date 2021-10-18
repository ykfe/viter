import React from 'react';
import { Link } from 'viter';

function About() {
  return (
    <div>
      welcome to about! <br />
      go to <Link to={'/home'}>home</Link>.
    </div>
  );
}

export default About;
