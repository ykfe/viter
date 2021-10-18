import React from 'react';
import { Link } from 'viter';

function Home() {
  return (
    <div className="Home">
      welcome to home! <br />
      go to <Link to={'/about'}>about</Link>.
    </div>
  );
}

export default Home;
