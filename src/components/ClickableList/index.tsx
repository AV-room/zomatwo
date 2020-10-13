import React, { useState } from 'react';
import './styles.scss';

const ClickableList = (Component: any) => {
  const [selected, setSelected] = useState(null);

  return ({ list, handleSelection }: any) => (
    <div className="list">
      {list && (
        <div>
          <h2>Results ({list.length})</h2>
          <ul>
            {list.map((item: any, i: number) => {
              return (
                <li
                  className={i === selected ? 'selected' : ''}
                  key={i}
                  onClick={(e) => {
                    setSelected(i);
                    handleSelection(i);
                  }}
                >
                  <Component item={item} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClickableList;
