export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'London'; // Default city is 'London'
  
    try {
      const apiKey = '015a19f3ed6541a3a3973304240912'; // Replace with your WeatherAPI key
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`
      );
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'City not found or API issue' }), { status: 404 });
      }
  
      const weatherData = await response.json();
  
      return new Response(JSON.stringify(weatherData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Something went wrong while fetching weather data' }), {
        status: 500,
      });
    }
  }