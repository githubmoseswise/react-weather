import loader from "./assets/loader.svg"; // Importer l'image du loader
import "./App.css"; // Importer les styles CSS
import { useEffect, useState } from "react"; // Importer les hooks useEffect et useState depuis React
import browser from "./assets/browser.svg"; // Importer l'image de l'icône d'erreur

const APIKEY = import.meta.env.VITE_WEATHER_API_KEY; // Charger la clé API depuis les variables d'environnement

function App() {
  // État pour stocker les données météo
  const [weatherData, setWeatherData] = useState(null);
  // État pour stocker les informations d'erreur
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données météo
    const fetchWeatherData = async () => {
      try {
        // Effectuer la requête pour obtenir les données météo
        const response = await fetch(
          `http://api.airvisual.com/v2/nearest_city?lat=35.98&lon=140.33&key=${APIKEY}`
        );

        // Vérifier si la réponse du réseau est correcte
        if (!response.ok) {
          throw new Error("La réponse du réseau n'est pas correcte");
        }

        // Parser les données JSON de la réponse
        const responseData = await response.json();
        console.log(responseData.data.current.weather);

        // Mettre à jour l'état avec les données météo
        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temperature: responseData.data.current.weather.tp,
        });
      } catch (error) {
        // Loguer les erreurs éventuelles
        console.error(
          "Il y a eu un problème avec l'opération de récupération des données :",
          error
        );
        // Assigner le message d'erreur à errorInfo
        setErrorInfo(error.message);
      }
    };

    // Appeler la fonction pour récupérer les données
    fetchWeatherData();
  }, []); // Le tableau de dépendances vide signifie que cet effet s'exécute une seule fois au montage du composant

  return (
    <main>
      {/* Afficher le loader tant que les données météo ou les erreurs ne sont pas disponibles */}
      <div
        className={`loader-container ${!weatherData && !errorInfo && "active"}`}
      >
        <img src={loader} alt="icône de chargement" />
      </div>

      {/* Afficher les données météo si elles sont disponibles */}
      {weatherData && (
        <>
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temperature}°C</p>
          <div className="info-icon-container">
            <img
              src={`/icons/${weatherData.iconId}.svg`}
              className="info-icon"
              alt="icône météo"
            />
          </div>
        </>
      )}

      {/* Afficher les informations d'erreur si elles sont disponibles et que les données météo ne sont pas disponibles */}
      {errorInfo && !weatherData && (
        <>
          <p className="error-information">{errorInfo}</p>{" "}
          {/* Afficher le message d'erreur */}
          <img src={browser} alt="error icon" />{" "}
          {/* Afficher l'icône d'erreur */}
        </>
      )}
    </main>
  );
}

export default App;
