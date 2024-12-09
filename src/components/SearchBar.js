import React, { useState } from 'react';
import '../SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [categorie, setCategorie] = useState('');

    // Fonction pour déclencher la recherche lorsque l'utilisateur clique sur "Rechercher"
    const handleSearch = () => {
        if (categorie.trim()) {
            onSearch(categorie.trim()); // Passe la catégorie à la fonction onSearch
        }
    };

    // Fonction pour gérer l'appui sur la touche "Entrée" sans recharger la page
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Lancer la recherche quand l'utilisateur appuie sur "Entrée"
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                className="search-input"
                placeholder="🔍 Entrez une catégorie (ex. Plombier)"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)} // Met à jour la valeur de l'input
                onKeyPress={handleKeyPress} // Déclenche la recherche si "Entrée" est pressé
            />
            <button className="search-button" onClick={handleSearch}> {/* Recherche via le bouton */}
                Rechercher
            </button>
        </div>
    );
};

export default SearchBar;
