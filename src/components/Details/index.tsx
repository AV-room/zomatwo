import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';
import { convertPriceBracketToSymbol } from '../../utils/helpers';

type DetailsProps = { restaurant: Restaurant };

const Details: React.FC<DetailsProps> = ({ restaurant }) => {
  const content = restaurant ? (
    <div className="details-container">
      <img className="image" src={restaurant.thumb}></img>
      <div className="text-content">
        <header>
          <h2 className="title">{restaurant.name}</h2>
          <p className="byline">{restaurant.location.address}</p>
        </header>
        <ul className="notables">
          {!restaurant.has_table_booking && (
            <li>
              {' '}
              <FontAwesomeIcon icon={faTimes} />
              No bookings
            </li>
          )}
          {Boolean(restaurant.has_online_delivery) && (
            <li>
              <FontAwesomeIcon icon={faCheck} />
              Delivery available
            </li>
          )}
        </ul>
        <dl className="details">
          <dt>Cuisines</dt>
          <dd>{restaurant.cuisines}</dd>
          <dt>Phone number</dt>
          <dd>{restaurant.phone_numbers}</dd>
          <dt>Opening hours</dt>
          <dd>{restaurant.timings}</dd>
          <dt>Price</dt>
          <dd>{convertPriceBracketToSymbol(restaurant.price_range)}</dd>
          <dt>Average rating</dt>
          <dd>{restaurant.user_rating.aggregate_rating}/5 </dd>
        </dl>
      </div>
    </div>
  ) : (
    <p>No restaurant selected</p>
  );

  // TODO: add badge

  return <div className="results-details-container">{content}</div>;
};

export default Details;
