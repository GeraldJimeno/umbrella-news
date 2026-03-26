import { useState, useEffect } from 'react';

// WMO Weather interpretation codes
const weatherCodes: Record<number, string> = {
    0: 'Sol Soleado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla escarchada',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    56: 'Llovizna helada',
    57: 'Llovizna helada',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    66: 'Lluvia',
    67: 'Lluvia',
    71: 'Nieve',
    73: 'Nieve',
    75: 'Nieve',
    77: 'Nieve',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos',
    85: 'Nieve',
    86: 'Nieve',
    95: 'Tormenta',
    96: 'Tormenta',
    99: 'Tormenta',
};

export function useWeather() {
    const [temp, setTemp] = useState<number | null>(null);
    const [desc, setDesc] = useState<string>("Cargando...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                // Santo Domingo coordinates: 18.4861 N, -69.9312 W
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=18.48&longitude=-69.93&current_weather=true");
                const data = await res.json();
                
                if (data?.current_weather) {
                    setTemp(Math.round(data.current_weather.temperature));
                    const code = data.current_weather.weathercode;
                    setDesc(weatherCodes[code] || "Soleado");
                } else {
                    setTemp(28);
                    setDesc("Sol Soleado");
                }
            } catch (err) {
                setTemp(28);
                setDesc("Sol Soleado");
            } finally {
                setLoading(false);
            }
        }
        
        fetchWeather();
    }, []);

    return { temp, desc, loading };
}
