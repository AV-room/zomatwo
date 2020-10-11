import React from 'react';
import './styles.scss';
import Restaurant from '../../interfaces/Restaurant';

type DetailsProps = { restaurant: Restaurant };

const Details: React.FC<DetailsProps> = ({ restaurant }) => {
  const content = restaurant ? (
    <div className="details-container">
      <img className="image" src={restaurant.thumb}></img>
      <div>
        <header>
          <h2 className="title">{restaurant.name}</h2>
          <p className="byline">{restaurant.location.address}</p>
        </header>
        <ul className="notables">
          <li>No bookings</li>
          <li>Delivery available</li>
        </ul>
        <dl className="details">
          <dt>Cuisines</dt>
          <dd>{restaurant.cuisines}</dd>
          <dt>Phone number</dt>
          <dd>{restaurant.phone_numbers}</dd>
          <dt>Opening hours</dt>
          <dd>{restaurant.timings}</dd>
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
