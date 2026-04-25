import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Configuration Firebase
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

// 2. Injection automatique du style "FadeIn"
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

const notifContainer = document.getElementById('notif-list-container');
const countLabel = document.getElementById('notif-badge'); // Utilise le badge comme compteur

// 3. Interface "Accès Verrouillé"
const showLoggedOutUI = () => {
    if (notifContainer) {
        notifContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; animation: fadeIn 0.8s ease;">
                <div style="font-size: 60px; margin-bottom: 20px;">🔒</div>
                <h3 style="color: #ffd700; margin-bottom: 15px; font-size: 22px;">Accès Restreint</h3>
                <p style="color: #888; font-size: 14px; margin-bottom: 30px; line-height: 1.6;">
                    Connectez-vous à votre compte CongoFlix pour lire vos messages et notifications.
                </p>
                <a href="https://draziel-creator.github.io/CongoFlix-/index.html" 
                   style="display: inline-block; background: #ffd700; color: #000; padding: 14px 35px; border-radius: 30px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);">
                   SE CONNECTER MAINTENANT
                </a>
            </div>
        `;
    }
    if(countLabel) countLabel.style.display = 'none';
};

// 4. Surveillance de la connexion
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilisateur connecté : On récupère les SMS
        const qNotifs = query(collection(db, "global_notifications"), orderBy("Timestamp", "desc"));

        onSnapshot(qNotifs, (snapshot) => {
            let html = "";
            let count = 0;

            snapshot.forEach((doc) => {
                const data = doc.data();
                count++;
                let title = data.title || data.Title || "Message Officiel";
                let message = data.message || data.Message || "";
                
                html += `
                    <div style="background: #111; padding: 18px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #222; border-left: 5px solid #ffd700; animation: fadeIn 0.5s ease;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #ffd700; font-size: 16px;">${title}</span>
                            <span style="font-size: 9px; color: #555; background: #222; padding: 2px 8px; border-radius: 10px;">INFO</span>
                        </div>
                        <div style="color: #ccc; font-size: 14px; line-height: 1.5;">${message}</div>
                    </div>`;
            });

            if (notifContainer) {
                notifContainer.innerHTML = count === 0 ? 
                    '<p style="text-align: center; color: #444; margin-top: 50px;">Aucun message pour le moment</p>' : html;
            }

            if(countLabel) {
                countLabel.innerText = count;
                countLabel.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    } else {
        // Utilisateur non connecté
        showLoggedOutUI();
    }
});
