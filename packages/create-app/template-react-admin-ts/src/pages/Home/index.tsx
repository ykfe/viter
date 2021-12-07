import React from 'react';
import { Link } from 'viter';

function Home() {
  return (
    <div className="Home">
      <p align="center">
        <a href="https://viterjs.github.io/" target="_blank" rel="noopener noreferrer">
          <img
            width="180"
            src="https://img.alicdn.com/imgextra/i4/O1CN01Y566rd1lxNVUjXnfJ_!!6000000004885-0-tps-754-600.jpg"
            alt="Viter logo"
          />
        </a>
        <h3>Home</h3>
        <span>
          go to <Link to={'/about'}>about</Link>.
        </span>
      </p>
    </div>
  );
}

export default Home;
