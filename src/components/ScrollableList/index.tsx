import React from 'react';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';
import { convertPriceBracketToSymbol } from '../../utils/helpers';

type ScrollableListProps = { list: Restaurant[]; handleSelection: Function };

const ScrollableList: React.FC<ScrollableListProps> = ({
  list,
  handleSelection
}) => {
  return (
    <div className="results-list">
      <h2>Results ({list.length})</h2>
      <ul>
        {list.map((r: Restaurant, i: number) => {
          return (
            <li key={i} onClick={(e) => handleSelection(i)}>
              {r.name}
              <div className="quick-bits">
                <span>{r.cuisines}</span> <br />
                <span>
                  {convertPriceBracketToSymbol(r.price_range)} |{' '}
                  {r.user_rating.aggregate_rating}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScrollableList;
