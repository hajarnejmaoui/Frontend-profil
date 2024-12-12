import React, { useState } from 'react';
import PrestataireList from './components/PrestataireList';
import FacturePage from './components/Facture';
import SearchBar from './components/SearchBar';
import './App.css';
import logo from '../src/assets/logo3.png'; // Importation du logo

const App = () => {
    const [categorie, setCategorie] = useState('');
    const [reservationDetails, setReservationDetails] = useState(null);

    const handleSearch = (categorie) => {
        setCategorie(categorie);
    };

    const handleReservation = (details) => {
        setReservationDetails(details); // Stocker les détails de la réservation
    };

    return (
        <div className="app-container">
            <img src={logo} alt="Logo" className="app-logo"/>
            <header className="app-header">
                <div className="header-content">

                    <div>
                        <h1 className="app-title">Trouvez et Réservez le Prestataire Idéal !</h1>
                        <p className="app-subtitle">
                            Entrez une catégorie pour rechercher parmi nos professionnels qualifiés.
                        </p>
                    </div>
                </div>
            </header>
            {!reservationDetails ? (
                <>
                    <SearchBar onSearch={handleSearch}/>
                    {categorie && (
                        <PrestataireList categorie={categorie} onReserve={handleReservation}/>
                    )}
                </>
            ) : (
                <FacturePage reservationDetails={reservationDetails}/>
            )}
        </div>
    );
};

export default App;
