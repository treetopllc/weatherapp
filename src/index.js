import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Weather from './Weather';

let search = window.location.search;
let params = new URLSearchParams(search);
let cityId = params.get('id');

if (!cityId) {
    // if no id, default to portland
    cityId = 5746545
    window.location.search = `id=${cityId}`
}

ReactDOM.render(<Weather cityId={cityId} />, document.getElementById('container'));
