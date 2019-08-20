import React, { Fragment } from 'react';
import isWithinRange from 'date-fns/isWithinInterval';
import setHours from 'date-fns/setHours';
import formatDate from 'date-fns/format';
import './Weather.css';

class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weather: [],
      city: '',
      daysOfWeek: [],
      cityId: this.props.cityId
    }
  }

  componentDidMount() {
    let rightNow = new Date()
    
    // get date objects for 7am/7pm with today's date
    let dayStart = setHours(new Date(rightNow), 7)
    let dayEnd = setHours(new Date(rightNow), 19)
    
    // (theoretically) switch light/dark theme depending on time of day
    if (isWithinRange(rightNow, { start: dayStart, end: dayEnd })) {
      document.getElementById('container').classList.add('light')
    } else {
      document.getElementById('container').classList.remove('dark')
    }
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + this.state.cityId + '&APPID=a5a15f743f397f70582223771d90cdd8&units=imperial')
      .catch(error => {
        console.warn(error)
        return null
      })
      .then(res => {
        return res.json()
      })
      .then(data => {
        let daysOfWeek = []
        let weather = data.list
        
        // stuff days of week from forecast into an array
        weather.forEach(time => {
          let date = new Date(time.dt * 1000)
          let day = formatDate(date, 'eeee, MMM do')
          if (!daysOfWeek.includes(day)) {
            daysOfWeek.push(day)
          }
        })
        this.setState({ weather, city: data.city.name, daysOfWeek })
      })
  }

  render() {
    let { city, weather, daysOfWeek } = this.state
    return (
      <div className="day-grid__container">
        <div className="day-grid">
          <h2>{city}</h2>
          <h3>Local time: {formatDate(new Date(), 'h:mm a')}</h3>
          <DaysOfWeek daysOfWeek={daysOfWeek} weather={weather} />
        </div>
      </div>
    )
  }
}

const DaysOfWeek = props => {
  let { daysOfWeek, weather } = props
  return (
    <Fragment>
      {daysOfWeek.map((day, i) => {
        return (
          <div key={i} className="day-grid__day">
            <div className="day-grid__day-header">{day}</div>
            <Times weather={weather} day={day} />
          </div>
        )
      })}
    </Fragment>
  )
}

const Times = props => {
  let { weather, day } = props
  return (
    <div className="day-grid__times">
      {weather.map((time, j) => {
        let date = new Date(time.dt * 1000)
        if (day === formatDate(date, 'eeee, MMM do')) {
          return <TimeBox time={time} date={date} key={j}/>
        }
        return null
      })}
    </div>
  )
}

const TimeBox = props => {
  let { date, time } = props
  return (
    <div className="day-grid__time">
      <span className="day-grid__time-display">{formatDate(date, 'ha')}</span>
      <img
        src={'http://openweathermap.org/img/w/' + time.weather[0].icon + '.png'}
        title={time.weather[0].main}
        alt={time.weather[0].main}
      />
      <span className="day-grid__temp-display">
        {Math.ceil(time.main.temp)}
        &deg;
      </span>
    </div>
  )
}

export default Weather;
