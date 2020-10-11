import React from 'react';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';

type ScrollableListProps = { list: Restaurant[]; handleSelection: Function };

const ScrollableList: React.FC<ScrollableListProps> = ({
  list,
  handleSelection
}) => {
  const names = list && list.map((r) => r.name);

  return (
    <div className="results-list">
      <h2>Results ({list.length})</h2>
      <ul>
        {list.map((r: any, i: number) => {
          return (
            <li key={i} onClick={(e) => handleSelection(i)}>
              {r.name}
              {/* <br />
              <em>{r.cuisines}</em> <br />${r.average_cost_for_two},{' '}
              {r.user_rating.aggregate_rating} */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScrollableList;
