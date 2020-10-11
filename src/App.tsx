import React, { useState, useEffect } from 'react';
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
import {
  getFilteredResults,
  getCuisines,
  SEARCH_API_MAX_RESULTS
} from './api/Api';
import { apiIds } from './api/ApiIdMap';
import { Filters } from './interfaces/Filters';
// import { Sort, SortType, SortOrder } from './interfaces/Sort';

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Restaurant[]>(null);
  const [resultsTotal, setResultsTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisines[]>([]);
  const [otherCuisineIds, setOtherCuisineIds] = useState<number[]>([]); // not the best
  const [rating, setRating] = useState<number[]>([0, 5]);
  const [cost, setCost] = useState<number[]>([0, 500]);
  // const [sortType, setSortType] = useState<string>('cost');
  // const [sortOrder, setSortOrder] = useState<string>('desc');

  useEffect(() => {
    setIsLoading(true);

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

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const filters: Filters = {
      categories,
      cuisines,
      cost
    };

    // const sorting: Sort = {
    //   type: sortType as SortType,
    //   order: sortOrder as SortOrder
    // };

    getFilteredResults(
      filters,
      // sorting,
      otherCuisineIds
    ).then((filteredRestaurants: Restaurant[]) => {
      setResults(filteredRestaurants);
      setResultsTotal(filteredRestaurants.length);

      setIsLoading(false);
    });
  }, [
    categories,
    cuisines,
    cost,
    rating
    // sortType,
    // sortOrder
  ]);

  const ratingValueText = (value: any) => value;
  const costValueText = (value: any) => `$${value}`;

  // const toggleSortOrder = (event: any) => {
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  // };

  // const toggleSortType = (event: any) => {
  //   setSortType(sortType === 'cost' ? 'rating' : 'cost');
  // };

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
    { label: 'Bubble Tea', value: Cuisines.bubbleTea },
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
      <div className="filter-panel">
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

        <div className="sliders">
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
        </div>
      </div>

      <div className="results-panel">
        <div className="results-list">
          <h1>
            Results (
            {resultsTotal < SEARCH_API_MAX_RESULTS
              ? resultsTotal
              : SEARCH_API_MAX_RESULTS}
            )
          </h1>
          {isLoading && (
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          )}

          {!isLoading && (
            <div>
              {/* <p>
        Sort: <button onClick={toggleSortType}>{sortType}</button>
        <button onClick={toggleSortOrder}>{sortOrder}</button>
      </p> */}
              <ul>
                {results &&
                  results.map((r, i) => (
                    <li>
                      <strong>
                        {i + 1}. {r.name}
                      </strong>{' '}
                      <br />
                      <em>{r.cuisines}</em> <br />${r.average_cost_for_two},{' '}
                      {r.user_rating.aggregate_rating}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div className="results-details">
          <h1>Details</h1>
        </div>
      </div>
    </div>
  );
};

export default App;
