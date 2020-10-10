import React, { useState, useEffect, FunctionComponent } from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import './App.scss';
import Restaurant from './interfaces/Restaurant';
import { Categories, Cuisines } from './enums';
import { Filters, getFilterResults, getCuisines } from './api/Api';
import { apiIds } from './api/ApiIdMap';

function App() {
  const [results, setResults] = useState<Restaurant[]>(null);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cuisines, setCuisines] = useState<Cuisines[]>([]);
  const [otherCuisineIds, setOtherCuisineIds] = useState<number[]>([]); // not the best

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

  const getNewCheckboxCollectionVal = (event: any, collection: any[]) => {
    return event.target.checked
      ? [...collection, event.target.name]
      : collection.filter((c) => c !== event.target.name);
  };

  const handleCategoriesChange = (event: any) => {
    setCategories(getNewCheckboxCollectionVal(event, categories));
  };

  const handleCuisinesChange = (event: any) => {
    setCuisines(getNewCheckboxCollectionVal(event, cuisines));
  };

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

      <h1>Results</h1>
      <ul>
        {results &&
          results.map((r) => (
            <li>
              <strong>{r.name}</strong> <br />
              <em>{r.highlights.join(', ')}</em> <br />
              {r.cuisines}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
