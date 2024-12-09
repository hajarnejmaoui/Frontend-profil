import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Facture.css";

const FacturePage = ({ reservationDetails }) => {
    const [detailsFacture, setDetailsFacture] = useState(null);
    const [articles, setArticles] = useState([]); // Stockage des articles
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState({ etoiles: 0, commentaire: '' });
    const [submittedReview, setSubmittedReview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);

    const fetchFactureDetails = async () => {
        setLoading(true);
        try {
            const lastIdResponse = await axios.get("http://localhost:9008/reservation/last-id");
            const lastReservationId = lastIdResponse.data;

            const factureResponse = await axios.get(
                `http://localhost:9008/reservation/${lastReservationId}/facture`
            );
            const facture = factureResponse.data;

            // Extraction des données principales
            const details = {
                reservationId: facture.match(/Réservation n° ?: (\d+)/)?.[1],
                category: facture.match(/Catégorie: (.+)/)?.[1],
                totalHT: facture.match(/Total HT de l'article : ([\d.]+)/)?.[1],
                totalTTC: facture.match(/Total TTC: ([\d.]+)/)?.[1],
                paymentMode: facture.match(/Mode de payement: (.+)/)?.[1],
                date: facture.match(/Date: (.+)/)?.[1],
                time: facture.match(/Heure: (.+)/)?.[1],
                address: facture.match(/Adresse: (.+)/)?.[1],
                prestataireNom: reservationDetails?.prestataire?.nom || 'Inconnu',
                prestataireTelephone: reservationDetails?.prestataire?.telephone || 'Inconnu',
            };

            // Extraction des articles
            const articleMatches = [...facture.matchAll(/(.+), Quantité: (\d+), Prix Unitaire: ([\d.]+), Total HT de l'article : ([\d.]+)/g)];
            const extractedArticles = articleMatches.map((match) => ({
                name: match[1],
                quantity: match[2],
                unitPrice: match[3],
                totalHT: match[4],
            }));

            setDetailsFacture(details);
            setArticles(extractedArticles);
            setError(null);
        } catch (err) {
            setError("Erreur lors de la récupération des détails de la facture. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFactureDetails();
    }, [reservationDetails]);

    const handleStarClick = (etoiles) => {
        setReview({ ...review, etoiles });
    };

    const handleCommentChange = (event) => {
        setReview({ ...review, commentaire: event.target.value });
    };

    const handleReviewSubmit = async () => {
        if (review.etoiles > 0 && review.commentaire) {
            try {
                await axios.post(
                    `http://localhost:9006/prestataires/${reservationDetails.prestataire.id}/reviews`,
                    review
                );
                setSubmittedReview({ ...review });
                setReview({ etoiles: 0, commentaire: '' });
                setSuccessMessage("Merci pour votre retour 🎉 !");
            } catch (error) {
                setError("Erreur lors de la soumission de votre avis. Veuillez réessayer.");
            }
        }
    };

    return (
        <div className="facture-container">
            <h2>Détails de la Facture</h2>

            {loading && <p>Chargement...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}

            {detailsFacture && (
                <div className="facture-details">
                    <p><strong>Réservation n°:</strong> {detailsFacture.reservationId}</p>
                    <p><strong>Catégorie:</strong> {detailsFacture.category}</p>
                   < p><strong>Nom du Prestataire:</strong> {detailsFacture.prestataireNom}</p>
                   <p><strong>Téléphone du Prestataire:</strong> {detailsFacture.prestataireTelephone}</p>
                    <h4>Articles :</h4>
                    {articles.length > 0 ? (
                        <table className="articles-table">
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Quantité</th>
                                <th>Prix Unitaire (€)</th>
                                <th>Total HT (€)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {articles.map((article, index) => (
                                <tr key={index}>
                                    <td>{article.name}</td>
                                    <td>{article.quantity}</td>
                                    <td>{article.unitPrice}</td>
                                    <td>{article.totalHT}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucun article trouvé.</p>
                    )}

                    <p><strong>Total HT:</strong> {detailsFacture.totalHT} €</p>
                    <p><strong>Total TTC:</strong> {detailsFacture.totalTTC} €</p>
                    <p><strong>Mode de paiement:</strong> {detailsFacture.paymentMode}</p>
                    <p><strong>Date:</strong> {detailsFacture.date}</p>
                    <p><strong>Heure:</strong> {detailsFacture.time}</p>
                    <p><strong>Adresse:</strong> {detailsFacture.address}</p>
                    < p><strong>Nom du Prestataire:</strong> {detailsFacture.prestataireNom}</p>
                    <p><strong>Téléphone du Prestataire:</strong> {detailsFacture.prestataireTelephone}</p>

                </div>
            )}
            <h3>Donner un Avis</h3>
            <div className="star-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`star ${review.etoiles >= star ? 'selected' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                placeholder="Laissez votre commentaire ici"
                value={review.commentaire}
                onChange={handleCommentChange}
            />
            <button onClick={handleReviewSubmit} disabled={!review.etoiles || !review.commentaire}>
                Soumettre l'avis
            </button>



            {submittedReview && (
                <div className="submitted-review">
                    <h3>Votre Avis :</h3>
                    <p>{submittedReview.commentaire}</p>

                    <div className="star-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${submittedReview.etoiles >= star ? 'selected' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {successMessage &&
                        <p className="review-message" style={{color: '#f3071b', padding: '10px', borderRadius: '5px'}}>
                            <i><b>{successMessage}</b></i></p>}
                </div>
            )}


        </div>
    );
};

export default FacturePage;
