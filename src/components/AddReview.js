import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const AddReview = () => {
    const { id } = useParams();
    const [commentaire, setCommentaire] = useState('');
    const [etoiles, setEtoiles] = useState(5);

    // Ajouter un avis
    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/prestataires/${id}/reviews`, {
                commentaire,
                etoiles,
            });
            alert('Avis ajouté avec succès !');
            setCommentaire('');
            setEtoiles(5);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avis', error);
        }
    };

    return (
        <div>
            <h2>Ajouter un avis</h2>
            <form onSubmit={submitReview}>
                <textarea
                    placeholder="Votre commentaire"
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                />
                <br />
                <label>
                    Étoiles :
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={etoiles}
                        onChange={(e) => setEtoiles(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default AddReview;
