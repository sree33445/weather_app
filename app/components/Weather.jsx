'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cloud, Sun, Wind, Droplet, Thermometer } from 'lucide-react';

export default function Weather({initialweather}) {
  const router = useRouter()
  const [city, setCity] = useState('');
  const [weather,setWeather] = useState(initialweather);
  const [favorites,setFavorites] = useState([]);

  useEffect(()=>{
    const savedFavorite = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorite);
  },[]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    try {
      const response = await fetch(`/api/weather?city=${city}`);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        router.push(`/?city=${city}`);
      } else {
        alert(data.error || 'City not found');
      }
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  };

  const addToFavorites = (city) =>{
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites,city];
      setFavorites(updatedFavorites)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }
  }

  const getWeatherIcon = (conditionText) => {
    const lowerCondition = conditionText.toLowerCase();
    if (lowerCondition.includes('cloud')) return <Cloud className="w-16 h-16 text-gray-500" />;
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <Sun className="w-16 h-16 text-yellow-500" />;
    return <Cloud className="w-16 h-16 text-gray-400" />;
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="p-6 bg-blue-600 text-white text-center">
          <h1 className="text-3xl font-bold tracking-wide">Weather Tracker</h1>
        </div>
        
        {/* Search Section */}
        <div className="p-6 bg-white">
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search for a city"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out"
            >
              Find Weather
            </button>
          </form>
        </div>

        {/* Weather Display */}
        {weather && (
          <div className="px-6 pb-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">{weather.location.name}</h2>
              <p className="text-gray-600">{weather.current.temp_c}°C - {weather.current.condition.text}</p>
            </div>

            <div className="flex justify-center mb-4">
              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="w-24 h-24"
              />
            </div>

            <button
              onClick={() => addToFavorites(weather.location.name)}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add to Favorites
            </button>

            {/* Hourly Forecast */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Hourly Forecast</h3>
              <div className="grid grid-cols-4 gap-2">
                {weather.forecast.forecastday[0].hour.slice(0, 4).map((hour, idx) => (
                  <div key={idx} className="text-center bg-blue-100 p-2 rounded-lg">
                    <p className="text-sm text-gray-700">{hour.time.split(' ')[1]}</p>
                    <img 
                      src={`https:${hour.condition.icon}`} 
                      alt={hour.condition.text} 
                      className="mx-auto w-10 h-10"
                    />
                    <p className="text-sm text-gray-800">{hour.temp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Forecast */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Weekly Forecast</h3>
              <div className="space-y-2">
                {weather.forecast.forecastday.map((day, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <p className="text-gray-700">{day.date}</p>
                    <img 
                      src={`https:${day.day.condition.icon}`} 
                      alt={day.day.condition.text} 
                      className="w-8 h-8"
                    />
                    <p className="text-gray-800 font-semibold">{day.day.avgtemp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Favorite Cities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {favorites.map((fav, idx) => (
                    <div 
                      key={idx} 
                      className="bg-blue-100 p-2 rounded-lg text-center text-gray-700 hover:bg-blue-200 transition-colors"
                    >
                      {fav}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
    const city = context.query.city || 'London';
    const res = await fetch(`http://localhost:3000/api/weather?city=${city}`);
    const data = await res.json();
  
    return {
      props: {
        initialWeather: data,
      },
    };
  }