import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Weather from './Weather';

let search = window.location.search;
let params = new URLSearchParams(search);
let cityId = params.get('id');

ReactDOM.render(<Weather cityId={cityId} />, document.getElementById('container'));
