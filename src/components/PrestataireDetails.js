import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PrestataireDetails = () => {
    const { id } = useParams();
    const [prestataire, setPrestataire] = useState(null);
    const [review, setReview] = useState(0);

    useEffect(() => {
        // Fetch prestataire details by id
        axios.get(`http://localhost:8080/prestataires/${id}`)
            .then(response => setPrestataire(response.data))
            .catch(error => console.error("Error fetching prestataire details:", error));
    }, [id]);

    const handleReviewSubmit = () => {
        if (review > 0 && review <= 5) {
            axios.post(`http://localhost:8080/prestataires/${id}/review`, { etoiles: review })
                .then(() => {
                    alert('Votre avis a été soumis!');
                })
                .catch(error => console.error('Error submitting review:', error));
        } else {
            alert('Veuillez donner une note entre 1 et 5.');
        }
    };

    if (!prestataire) {
        return <p>Chargement...</p>;
    }

    return (
        <div>
            <h1>Détails du Prestataire</h1>
            <h3>{prestataire.nom}</h3>
            <p>Catégorie: {prestataire.categorie}</p>
            <p>Commandes traitées: {prestataire.commandesTraitees}</p>
            <p>Étoiles: {prestataire.review }</p>

            <div>
                <h4>Laissez un avis:</h4>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button onClick={handleReviewSubmit}>Envoyer</button>
            </div>
        </div>
    );
};

export default PrestataireDetails;
