import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
        <span className="gradient-text">Ultimate</span>
        <span className="text-white"> Tic Tac Toe</span>
      </h1>
      <p className="text-slate-400 text-lg">
        The strategic twist on the classic game
      </p>
    </header>
  );
};

export default Header;
