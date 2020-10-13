import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';
import { convertPriceBracketToSymbol } from '../../utils/helpers';

type ScrollableListProps = { list: Restaurant[]; handleSelection: Function };

const ScrollableList: React.FC<ScrollableListProps> = ({
  list,
  handleSelection
}) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="results-list">
      {list && (
        <div>
          <h2>Results ({list.length})</h2>
          <ul>
            {list.map((r: Restaurant, i: number) => {
              return (
                <li
                  className={i === selected ? 'selected' : ''}
                  key={i}
                  onClick={(e) => {
                    setSelected(i);
                    handleSelection(i);
                  }}
                >
                  {r.name}
                  <div className="quick-bits">
                    <span>{r.cuisines}</span> <br />
                    <span>
                      <FontAwesomeIcon icon={faStar} />
                      {r.user_rating.aggregate_rating} |
                      {/* {convertPriceBracketToSymbol(r.price_range)} */}
                      {r.average_cost_for_two}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScrollableList;
