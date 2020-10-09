import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import './App.scss';
import Restaurant from './interfaces/Restaurant';

function App() {
  const [results, setResults] = useState<Restaurant[]>(null);

  useEffect(() => {
    const entityType: string = 'city';
    const entityId: number = 297; // Adelaide, SA
    const cuisines: string = '298';
    const url: string = `https://developers.zomato.com/api/v2.1/search?entity_type=${entityType}&entity_id=${entityId}&cuisines=${cuisines}`;

    const requestOptions: AxiosRequestConfig = {
      url,
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'user-key': 'd7d72ddcee1493db536aeeb88ae2440c'
      }
    };

    axios(requestOptions).then((res) => {
      const restaurants: Restaurant[] = res.data.restaurants.map(
        (dataItem: { restaurant: {} }) => dataItem.restaurant
      );

      setResults(restaurants);
    });
  }, []);

  return <div className="container">hey</div>;
}

export default App;
