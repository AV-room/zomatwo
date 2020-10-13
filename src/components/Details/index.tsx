import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';
import { convertPriceBracketToSymbol } from '../../utils/helpers';
import placeholderImage from '../../images/placeholder.jpeg';

type DetailsProps = {
  restaurant: Restaurant;
  showDetails: boolean;
  handleSelectionClose: any;
};

const Details: React.FC<DetailsProps> = ({
  restaurant,
  showDetails,
  handleSelectionClose
}) => {
  const handleImgLoadError = (event: any) => {
    event.target.src = placeholderImage;
  };

  return (
    <div className={'results-details-container ' + (showDetails ? 'show' : '')}>
      {restaurant && (
        <div className="details-container">
          <button className="close" onClick={handleSelectionClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <img
            className="image"
            src={restaurant.thumb || placeholderImage}
            alt="restaurant thumbnail"
            onError={handleImgLoadError}
          ></img>
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
              <dt>Good to know</dt>
              <dd>{restaurant.highlights.join(', ')}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
