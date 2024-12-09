import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../PrestataireList.css';

const PrestataireList = ({ categorie, onReserve }) => {
    const [prestataires, setPrestataires] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categorie) {
            const fetchPrestataires = async () => {
                try {
                    const response = await axios.get(`http://localhost:9006/prestataires/categorie/${categorie}`);
                    const prestatairesWithReviews = await Promise.all(
                        response.data.map(async (prestataire) => {
                            // Récupérer les avis associés à chaque prestataire
                            const reviewsResponse = await axios.get(`http://localhost:9006/prestataires/${prestataire.id}/reviews`);
                            return { ...prestataire, reviews: reviewsResponse.data };
                        })
                    );
                    setPrestataires(prestatairesWithReviews);
                    setError(null);
                } catch (err) {
                    console.error("Erreur lors de la récupération des prestataires :", err.message);
                    setPrestataires([]);
                    setError("Impossible de récupérer les prestataires. Veuillez réessayer plus tard.");
                }
            };

            fetchPrestataires();
        }
    }, [categorie]);

    const reserverPrestataire = async (prestataire) => {
        try {
            // Simuler la réponse sans appeler la requête HTTP
            const response = {
                data: {
                    facture: "Facture simulée pour le prestataire " + prestataire.id, // Exemple de données simulées
                },
            };
            onReserve({
                facture: response.data.facture,
                prestataire,
            });
        } catch (error) {
            console.error("Erreur lors de la réservation :", error.response || error.message);
            setError("Erreur lors de la réservation. Veuillez réessayer.");
        }
    };

    return (
        <div className="container">
            <h2>Prestataires - {categorie}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {prestataires.length === 0 && !error ? (
                <p>Aucun prestataire trouvé pour cette catégorie.</p>
            ) : (
                <ul>
                    {prestataires.map(prestataire => (
                         <li key={prestataire.id}>
                            <div>
                                <strong>{prestataire.nom}</strong> - {prestataire.categorie}
                                {prestataire.disponible ? (
                                    <span className="badge">Disponible</span>
                                ) : (
                                    <span className="badge reserved">Réservé</span>
                                )}
                            </div>

                            <p><strong>Commandes traitées :</strong> {prestataire.commandesTraitees}</p>
                            <p><strong> Etoiles :</strong> {prestataire.review}</p>

                            {/* Affichage des avis récupérés */}
                            {prestataire.reviews && prestataire.reviews.length > 0 ? (
                                <div>
                                    <strong>Commentaire reçus :</strong>
                                    <ul>
                                        {prestataire.reviews.map((review, index) => (
                                            <li key={index}>
                                                <p>{review.commentaire}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>Aucun avis pour ce prestataire.</p>
                            )}

                            {prestataire.disponible ? (
                                <button onClick={() => reserverPrestataire(prestataire)}>
                                    Réserver ce prestataire
                                </button>
                            ) : (
                                <button disabled>Prestataire déjà réservé</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PrestataireList;
