import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuration Firebase (Identique à ton Accueil)
const firebaseConfig = { 
    apiKey: "AIzaSyCSdIitm-2_0hC1a01_ssztFUPkEsSA_lY", 
    authDomain: "congo-streaming-51333.firebaseapp.com", 
    projectId: "congo-streaming-51333", 
    storageBucket: "congo-streaming-51333.firebasestorage.app", 
    messagingSenderId: "304286627819", 
    appId: "1:304286627819:web:ee606adc4f6b4002054bae" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Éléments du DOM
const notifContainer = document.getElementById('notif-list-container');
const countLabel = document.getElementById('notif-badge');

/**
 * Charge les notifications en temps réel depuis Firebase
 */
const loadNotifications = () => {
    // On écoute la collection "global_notifications" triée par date décroissante
    const qNotifs = query(collection(db, "global_notifications"), orderBy("Timestamp", "desc"));
    
    onSnapshot(qNotifs, (snapshot) => {
        let html = "";
        let count = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            count++;
            
            // Gestion des majuscules/minuscules sur les clés Title/Message
            let title = data.title || data.Title || "CongoFlix";
            let message = data.message || data.Message || "Nouveau contenu disponible.";
            
            // Construction du design de la notification
            html += `
                <div style="background:#111; padding:15px; border-radius:12px; margin-bottom:12px; border-left:4px solid #ffd700; margin-left:10px; margin-right:10px;">
                    <b style="color:#ffd700; font-size:16px;">${title}</b><br>
                    <div style="color:#ccc; font-size:14px; margin-top:5px; line-height:1.4;">${message}</div>
                </div>`;
        });

        // Mise à jour de la liste dans le modal
        if (notifContainer) {
            notifContainer.innerHTML = (count === 0) 
                ? '<p style="text-align:center; color:#555; margin-top:50px;">Aucune notification pour le moment.</p>' 
                : html;
        }

        // --- GESTION DU COMPTEUR ROUGE (CLOCHE) ---
        if (countLabel) { 
            countLabel.innerText = count; 
            // Si count > 0, on affiche le badge rouge en "flex", sinon on le cache
            countLabel.style.display = (count > 0) ? 'flex' : 'none'; 
        }
    }, (error) => {
        console.error("Erreur lors de l'écoute des notifications:", error);
    });
};

// Lancement automatique du service
loadNotifications();
