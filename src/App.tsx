import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { isEqual } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.scss';
import Restaurant from './interfaces/Restaurant';
import { Categories, Cuisines } from './enums';
import { getCuisines } from './api/Api';
import { apiIds } from './api/ApiIdMap';
import { Filters } from './interfaces/Filters';
import ClickableList from './components/ClickableList';
import CheckboxGroup from './components/Checkbox';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import {
  DEFAULT_COST_BOUNDS,
  DEFAULT_RATING_BOUNDS,
  BP_MED,
  BP_LGE
} from './utils/constants';
import { getFilteredResults } from './filtering';
import WithImageAndHeader from './components/WithImageAndHeader';
import RestaurantDetails from './components/RestaurantDetails';
import RestaurantResultsListItem from './components/RestaurantResultsListItem';

const App = () => {
  const [isPostInitialRender, setIsPostInitialRender] = useState<boolean>(
    false
  );
  const [openFilterPanel, setOpenFilterPanel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [results, setResults] = useState<Restaurant[]>(null);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisines[]>([]);
  const [otherCuisineIds, setOtherCuisineIds] = useState<number[]>([]);
  const [rating, setRating] = useState<number[]>([0, 5]);
  const [cost, setCost] = useState<number[]>([0, 500]);
  const [selected, setSelected] = useState<number>(null);
  const [showMobileViewDetails, setShowMobileViewDetails] = useState<boolean>(
    false
  );

  useEffect(() => {
    setIsLoading(true);

    // determine other cuisine ids
    getCuisines().then((allCuisineIds: number[]) => {
      if (allCuisineIds) {
        setOtherCuisineIds(
          allCuisineIds.filter(
            (cId: number) => !Object.values(apiIds.cuisines).includes(cId)
          )
        );
      } else {
        setHasErrored(true);
      }

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth > BP_MED) {
        setShowMobileViewDetails(false);
      }
      if (window.innerWidth > BP_LGE) {
        setOpenFilterPanel(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isPostInitialRender) {
      setIsLoading(true);

      const filters: Filters = {
        categories,
        cuisines,
        cost,
        rating
      };

      getFilteredResults(filters, otherCuisineIds).then(
        (filteredRestaurants: Restaurant[]) => {
          if (filteredRestaurants) {
            setResults(filteredRestaurants);
          } else {
            setHasErrored(true);

            if (results !== null) {
              setResults(null);
              setSelected(null);
            }
          }

          setIsLoading(false);
        }
      );
    }

    if (!isPostInitialRender) {
      setIsPostInitialRender(true);
    }
  }, [categories, cuisines, cost, rating]);

  const ratingValueText = (value: any) => value;
  const costValueText = (value: any) => `$${value}`;

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
    { label: 'Bubble Tea', value: Cuisines.bubbleTea },
    { label: 'Other', value: Cuisines.other }
  ];

  const ratingMarks = [
    {
      value: DEFAULT_RATING_BOUNDS[0],
      label: '0'
    },
    {
      value: DEFAULT_RATING_BOUNDS[1],
      label: '5'
    }
  ];

  const costMarks = [
    {
      value: DEFAULT_COST_BOUNDS[0],
      label: '$'
    },
    {
      value: DEFAULT_COST_BOUNDS[1],
      label: '$$$$'
    }
  ];

  const handleCategoriesChange = (categories: Categories[]) => {
    setCategories(categories);
  };

  const handleCuisinesChange = (cuisines: Cuisines[]) => {
    setCuisines(cuisines);
  };

  const handleRatingChange = (event: any, newValue: any) => {
    setRating(newValue);
  };

  const handleCostChange = (event: any, newValue: any) => {
    setCost(newValue);
  };

  const handleSelection = (restaurantId: number) => {
    setSelected(restaurantId);
    setShowMobileViewDetails(true);
  };

  const handleSelectionClose = () => {
    setShowMobileViewDetails(false);
  };

  const handleFilterClick = (event: any) => {
    setOpenFilterPanel(!openFilterPanel);
  };

  const handleErrorDismissal = (event: any) => {
    setHasErrored(false);
    setResults([]);
    resetFilters();
  };

  // reset without triggering changes to state, which will trigger further API calls
  const resetFilters = () => {
    if (categories.length > 0) {
      setCategories([]);
    }

    if (cuisines.length > 0) {
      setCuisines([]);
    }

    if (!isEqual(cost, DEFAULT_COST_BOUNDS)) {
      setCost(DEFAULT_COST_BOUNDS);
    }

    if (!isEqual(rating, DEFAULT_RATING_BOUNDS)) {
      setRating(DEFAULT_RATING_BOUNDS);
    }
  };

  // higher order components
  const RestaurantResultsList = ClickableList(RestaurantResultsListItem);
  const RestaurantDetailsWithImageAndHeader = WithImageAndHeader(
    RestaurantDetails
  );

  return (
    <div className="container">
      {hasErrored && (
        <Alert
          type="error"
          message="There has been an error."
          handleDismissal={handleErrorDismissal}
        />
      )}
      <button className="show-filters" onClick={handleFilterClick}>
        Filter
      </button>
      <div className={'filter-panel ' + (openFilterPanel ? 'show' : '')}>
        <div className="checkbox-groups">
          <CheckboxGroup
            name="category"
            label="Category"
            childLabelValues={categoryCheckboxes}
            checkedVals={categories}
            onChange={handleCategoriesChange}
          />
          <CheckboxGroup
            name="cuisine"
            label="Cuisine"
            childLabelValues={cuisineCheckboxes}
            checkedVals={cuisines}
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
              min={DEFAULT_RATING_BOUNDS[0]}
              max={DEFAULT_RATING_BOUNDS[1]}
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
              min={DEFAULT_COST_BOUNDS[0]}
              max={DEFAULT_COST_BOUNDS[1]}
              step={10}
              marks={costMarks}
            />
          </div>
        </div>
      </div>

      <div>
        {isLoading && <Spinner />}
        {!isLoading && (
          <div className="results-panel">
            <div className="results-list-container">
              <RestaurantResultsList
                list={results}
                handleSelection={handleSelection}
              />
            </div>
            <div
              className={
                'results-details-container ' +
                (showMobileViewDetails ? 'show-mobile' : '')
              }
            >
              <button className="close" onClick={handleSelectionClose}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              {results !== null && selected !== null && (
                <RestaurantDetailsWithImageAndHeader
                  title={results[selected].name}
                  byline={results[selected].location.address}
                  imageSrc={results[selected].thumb}
                  imageAlt="restaurant thumbnail"
                  restaurant={results[selected]}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
