import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-4 h-4 bg-[#cd2027]" />
        <h1 className="text-2xl font-semibold tracking-tight">Planificador de Sinergias · La Grieta</h1>
      </div>
      <p className="text-gray-500 font-light text-lg max-w-2xl">
        Explora tu proyecto, combina servicios y obtén una estimación realista.
      </p>
      <hr className="mt-8 border-gray-100" />
    </header>
  );
};

export default Header;