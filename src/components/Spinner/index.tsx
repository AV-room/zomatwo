import React from 'react';
import './styles.scss';

const Spinner: React.FC<{}> = () => {
  return (
    <div className="spinner">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Spinner;
