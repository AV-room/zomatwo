import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import './App.scss';
import Restaurant from './interfaces/Restaurant';
import { Categories, Cuisines } from './enums';
import { getFilteredResults, getCuisines } from './api/Api';
import { apiIds } from './api/ApiIdMap';
import { Filters } from './interfaces/Filters';
import ScrollableList from './components/ScrollableList';
import Details from './components/Details';
import CheckboxGroup from './components/Checkbox';
// import { Sort, SortType, SortOrder } from './interfaces/Sort';

const App = () => {
  const [openFilterPanel, setOpenFilterPanel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Restaurant[]>(null);
  const [resultsTotal, setResultsTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisines[]>([]);
  const [otherCuisineIds, setOtherCuisineIds] = useState<number[]>([]); // not the best
  const [rating, setRating] = useState<number[]>([0, 5]);
  const [cost, setCost] = useState<number[]>([0, 500]);
  const [selected, setSelected] = useState<number>(null);
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

      setOtherCuisineIds(
        allCuisineIds.filter(
          (cId: number) => !Object.values(apiIds.cuisines).includes(cId)
        )
      );

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 890 && openFilterPanel) {
        setOpenFilterPanel(false);
      }
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
    // { label: 'Pubs & Bars', value: Categories.pubsBars },
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
    { label: 'Bubble Tea', value: Cuisines.bubbleTea },
    { label: 'Other', value: Cuisines.other }
  ];

  const handleCategoriesChange = (categories: Categories[]) => {
    setCategories(categories);
  };

  const handleCuisinesChange = (cuisines: Cuisines[]) => {
    setCuisines(cuisines);
  };

  const handleRatingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: any
  ) => {
    setRating(newValue);
  };

  const handleCostChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: any
  ) => {
    setCost(newValue);
  };

  const handleSelection = (restaurantId: number) => {
    setSelected(restaurantId);
  };

  const handleFilterClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenFilterPanel(!openFilterPanel);
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
      <button className="show-filters" onClick={handleFilterClick}>
        Filter
      </button>
      <div className={'filter-panel ' + (openFilterPanel ? 'show' : '')}>
        <div className="checkbox-groups">
          <CheckboxGroup
            name="category"
            label="Category"
            childLabelValues={categoryCheckboxes}
            onChange={handleCategoriesChange}
          />
          <CheckboxGroup
            name="cuisine"
            label="Cuisine"
            childLabelValues={cuisineCheckboxes}
            onChange={handleCuisinesChange}
          />
        </div>

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
        {isLoading && (
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        )}
        {!isLoading && results && (
          <div className="list-and-details">
            <ScrollableList list={results} handleSelection={handleSelection} />
            <Details restaurant={results[selected]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
