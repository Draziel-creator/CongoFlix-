import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

const notifContainer = document.getElementById('notif-list-container');
const countLabel = document.getElementById('notif-badge');

// FONCTION POUR AFFICHER LES MESSAGES
const loadNotifications = () => {
    const qNotifs = query(collection(db, "global_notifications"), orderBy("Timestamp", "desc"));
    onSnapshot(qNotifs, (snapshot) => {
        let html = "";
        let count = 0;
        snapshot.forEach((doc) => {
            const data = doc.data();
            count++;
            let title = data.title || data.Title || "Message";
            let message = data.message || data.Message || "";
            html += `
                <div style="background:#111; padding:15px; border-radius:12px; margin-bottom:12px; border-left:4px solid #ffd700;">
                    <b style="color:#ffd700">${title}</b><br>
                    <span style="color:#ccc; font-size:14px;">${message}</span>
                </div>`;
        });
        if(notifContainer) notifContainer.innerHTML = count === 0 ? '<p style="text-align:center; color:#444;">Aucun message</p>' : html;
        if(countLabel) { 
            countLabel.innerText = count; 
            countLabel.style.display = count > 0 ? 'flex' : 'none'; 
        }
    });
};

// FONCTION POUR AFFICHER LE CADENAS AVEC VÉRIFICATION SANS ERREUR
const showLoggedOutUI = () => {
    if(notifContainer) {
        notifContainer.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:50px; margin-bottom:15px;">🔒</div>
                <h3 style="color:#ffd700;">Accès Restreint</h3>
                <p style="color:#888; font-size:14px; margin-bottom:20px;">Connectez-vous sur votre profil, puis revenez ici pour cliquer sur le bouton.</p>
                <button id="check-auth-btn" 
                   style="background:#ffd700; color:#000; padding:12px 25px; border:none; border-radius:20px; font-weight:bold; cursor:pointer; width:100%;">
                   VÉRIFIER MA CONNEXION
                </button>
            </div>`;

        // Écouteur de clic pour vérifier la connexion sans recharger
        const btn = document.getElementById('check-auth-btn');
        if(btn) {
            btn.onclick = () => {
                if (auth.currentUser) {
                    loadNotifications();
                } else {
                    btn.innerText = "CONNEXION NON DÉTECTÉE...";
                    btn.style.background = "#333";
                    btn.style.color = "#fff";
                    setTimeout(() => {
                        btn.innerText = "VÉRIFIER MA CONNEXION";
                        btn.style.background = "#ffd700";
                        btn.style.color = "#000";
                    }, 2000);
                }
            };
        }
    }
};

// --- LE CERVEAU DU FICHIER ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadNotifications();
    } else {
        showLoggedOutUI();
    }
});
