import React, { useState, useEffect, FunctionComponent } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import './App.scss';
import Restaurant from './interfaces/Restaurant';
import { Categories, Cuisines } from './enums';
import { Filters, getFilterResults, getCuisines } from './api/Api';
import { apiIds } from './api/ApiIdMap';

function ratingValueText(value: any) {
  return `${value}°C`;
}

function costValueText(value: any) {
  return `$${value}`;
}

function App() {
  const [results, setResults] = useState<Restaurant[]>(null);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisines[]>([]);
  const [otherCuisineIds, setOtherCuisineIds] = useState<number[]>([]); // not the best
  const [rating, setRating] = React.useState([0, 5]);
  const [cost, setCost] = React.useState([0, 500]);

  useEffect(() => {
    // determine other cuisine ids
    getCuisines().then((res) => {
      const allCuisineIds = res.data.cuisines.map(
        (dataItem: { cuisine: { cuisine_id: number } }) =>
          dataItem.cuisine.cuisine_id
      );

      // setOtherCuisineIds([247, 287]);
      setOtherCuisineIds(
        allCuisineIds.filter(
          (cId: number) => !Object.values(apiIds.cuisines).includes(cId)
        )
      );
    });
  }, []);

  useEffect(() => {
    // query search API for filter results
    const filters: Filters = {
      categories,
      cuisines
    };

    getFilterResults(filters, otherCuisineIds).then((res) => {
      const restaurants: Restaurant[] = res.data.restaurants.map(
        (dataItem: { restaurant: {} }) => dataItem.restaurant
      );

      setResults(restaurants);
    });
  }, [categories, cuisines]);

  const categoryCheckboxes = [
    { label: 'Dining', value: Categories.dining },
    { label: 'Take-Away', value: Categories.takeaway },
    { label: 'Delivery', value: Categories.delivery },
    { label: 'Pubs & Bars', value: Categories.pubsBars },
    { label: 'Nightlife', value: Categories.nightlife }
  ];

  const cuisineCheckboxes = [
    { label: 'Cafe Food', value: Cuisines.cafe },
    { label: 'Coffee and Tea', value: Cuisines.coffee },
    { label: 'Pizza', value: Cuisines.pizza },
    { label: 'Fast Food', value: Cuisines.fast },
    { label: 'Asian', value: Cuisines.asian },
    { label: 'Bakery', value: Cuisines.bakery },
    { label: 'Italian', value: Cuisines.italian },
    { label: 'Sandwich', value: Cuisines.sandwich },
    { label: 'Chinese', value: Cuisines.chinese },
    { label: 'Pub Food', value: Cuisines.pub },
    { label: 'Egyptian', value: Cuisines.egyptian },
    { label: 'Other', value: Cuisines.other }
  ];

  const getNewCheckboxGroupVal = (event: any, collection: any[]) => {
    return event.target.checked
      ? [...collection, event.target.name]
      : collection.filter((c) => c !== event.target.name);
  };

  const handleCategoriesChange = (event: any) => {
    setCategories(getNewCheckboxGroupVal(event, categories));
  };

  const handleCuisinesChange = (event: any) => {
    setCuisines(getNewCheckboxGroupVal(event, cuisines));
  };

  const handleRatingChange = (event: any, newValue: any) => {
    setRating(newValue);
  };

  const handleCostChange = (event: any, newValue: any) => {
    setCost(newValue);
  };

  const ratingMarks = [
    {
      value: 0,
      label: '0'
    },
    {
      value: 5,
      label: '5'
    }
  ];

  const costMarks = [
    {
      value: 0,
      label: '$'
    },
    {
      value: 500,
      label: '$$$$'
    }
  ];

  return (
    <div className="container">
      <h1>Filters</h1>
      <FormControl component="fieldset">
        <FormLabel component="legend">Category</FormLabel>
        <FormGroup>
          {categoryCheckboxes.map((cb: { label: string; value: any }, i) => (
            <FormControlLabel
              control={
                <Checkbox
                  key={i}
                  checked={categories.includes(cb.value as Categories)}
                  onChange={handleCategoriesChange}
                  name={cb.value}
                />
              }
              label={cb.label}
            />
          ))}
        </FormGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Cuisines</FormLabel>
        <FormGroup>
          {cuisineCheckboxes.map((cb: { label: string; value: any }, i) => (
            <FormControlLabel
              control={
                <Checkbox
                  key={i}
                  checked={cuisines.includes(cb.value as Cuisines)}
                  onChange={handleCuisinesChange}
                  name={cb.value}
                />
              }
              label={cb.label}
            />
          ))}
        </FormGroup>
      </FormControl>

      <div className="slider">
        <Typography id="rating-range-slider" gutterBottom>
          Rating
        </Typography>
        <Slider
          value={rating}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          aria-labelledby="rating-range-slider"
          getAriaValueText={ratingValueText}
          min={0}
          max={5}
          step={0.1}
          marks={ratingMarks}
        />
      </div>

      <div className="slider">
        <Typography id="cost-range-slider" gutterBottom>
          Cost
        </Typography>
        <Slider
          value={cost}
          onChange={handleCostChange}
          valueLabelDisplay="auto"
          aria-labelledby="cost-range-slider"
          getAriaValueText={costValueText}
          min={0}
          max={500}
          step={10}
          marks={costMarks}
        />
      </div>

      <h1>Results</h1>
      <ul>
        {results &&
          results.map((r) => (
            <li>
              <strong>{r.name}</strong> <br />
              <em>{r.highlights.join(', ')}</em> <br />
              {r.cuisines} <br />${r.average_cost_for_two}, {r.price_range}{' '}
              <br />
              {r.user_rating.aggregate_rating}, {r.user_rating.rating_text}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
