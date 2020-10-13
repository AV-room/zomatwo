import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';
import { convertPriceBracketToSymbol } from '../../utils/helpers';

type RestaurantResultsListItemProps = {
  item: Restaurant; // only works with ClickableList when both use the same reference name ("item")
};

const RestaurantResultsListItem: React.FC<RestaurantResultsListItemProps> = ({
  item
}) => {
  return (
    <div>
      {item.name}
      <div className="quick-bits">
        <span>{item.cuisines}</span> <br />
        <span>
          <FontAwesomeIcon icon={faStar} />
          {item.user_rating.aggregate_rating} |
          {convertPriceBracketToSymbol(item.price_range)}
          {/* {item.average_cost_for_two} */}
        </span>
      </div>
    </div>
  );
};

export default RestaurantResultsListItem;
