import {useState, useEffect} from 'react';
import {FormControl,Select, MenuItem, Card, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData} from './util';

import './App.css';

function App() {

  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, settableData] = useState([]);

  useEffect(()=> {

     fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      // All the country data is set to the state
    setCountryInfo(data);

    })
  },[]);
  
  useEffect(()=> {

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        let i = 0;
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
            key : i++
          }
          
        ))

        const sortedData = sortData(data);
        settableData(sortedData);
        setCountries(countries);
      });

    };

    
    getCountriesData();


  }, [])

  const selectCountry = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all'
                 : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      // Country is set to the country code so that the dropdown is updated.
      setCountry(countryCode);

      // All the country data is set to the state
      
      setCountryInfo(data);
    })

  }
  return (
    <div className="app">

      

      <div className="app__left">
      <div className="app__header">
        <h1>COVID19 TRACKER</h1>
        <FormControl className="app__dropdown">
        <Select
        variant="outlined"
        value={country}
        onChange={selectCountry}>
         <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          
          countries.map(country => (
            
            <MenuItem key={country.key} value={country.value}>{country.name}</MenuItem>
          ))
        }  
        </Select>
        </FormControl>
      </div>
      <div className="app__stats">

         <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>

         <InfoBox  title="Recoverd" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>

         <InfoBox  title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>

      
      
      <Map/>
      
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
            <Table countries={tableData}/>
          <h3>Worldwide New Cases</h3>
            <LineGraph/>
        </CardContent>
      </Card>

     
    </div>
  );
}

export default App;
