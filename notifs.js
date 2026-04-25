import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const notifContainer = document.getElementById('notif-list-container');
const countLabel = document.getElementById('notif-badge');

// ON CHARGE DIRECTEMENT SANS VÉRIFIER
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

// Lancement immédiat
loadNotifications();
