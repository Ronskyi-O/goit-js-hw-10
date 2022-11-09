import Debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/components/fetchCountries';

const DEBOUNCE_DELAY = 300;

let getEl = selector => document.querySelector(selector)
let searchCountryName = '';

getEl('#search-box').addEventListener("input", Debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
    searchCountryName = getEl('#search-box').value.trim();
    if (searchCountryName === '') {
        clearAll();
        return;
    } else fetchCountries(searchCountryName).then(countryNames => {
        if (countryNames.length < 2) {
            createCountrieCard(countryNames);
        } else if (countryNames.length < 10 && countryNames.length > 1) {
            createCountrieList(countryNames);
        } else {
            clearAll();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name');
        };
    })
        .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

function createCountrieCard(country) {
    clearAll();
    const { flags, name, capital, population, languages} = country[0];
    const cardOfOneCountry = `<div class="country-card">
        <div class="country-card--header">
            <img src="${flags.svg}" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${capital}</span></p>
            <p class="country-card--field">Population: <span class="country-value">${population}</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(languages).join(',')}</span></p>
    </div>`
    getEl('.country-info').innerHTML = cardOfOneCountry;
};

function createCountrieList(country) {
    clearAll();
    const listOfCountries = country.map(({flags, name}) => 
        `<li class="country-list--item">
            <img src="${flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${name.official}</span>
        </li>`)
        .join("");
    getEl('.country-list').insertAdjacentHTML('beforeend', listOfCountries);
};

function clearAll() {
    getEl('.country-list').innerHTML = '';
    getEl('.country-info').innerHTML = '';
};