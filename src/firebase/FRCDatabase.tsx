// //firebase
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, push, set, runTransaction, get, onValue, type DatabaseReference } from "firebase/database"
// import { CURRENTMATCHREFNAME } from "../Constants";

import { onValue, type DatabaseReference } from "firebase/database";
import type { FRCGame } from "../classes/FRCGame";
import { addDoc, collection, doc, Firestore, setDoc } from "firebase/firestore";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// apiKey: "AIzaSyCk4X0qVprdIYWoMdtTnSs0qVAqR_zcQBY",
// authDomain: "scoutingapp-bd57b.firebaseapp.com",
// projectId: "scoutingapp-bd57b",
// storageBucket: "scoutingapp-bd57b.firebasestorage.app",
// messagingSenderId: "345042135934",
// appId: "1:345042135934:web:3499e51bc4ebde3d5e212f",
// measurementId: "G-Q5EL55034N"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// /** @return the firebase ref used for all data relating to the current real time match (eg. points being scored in each category) */
// export function getCurrentMatchRef(){
//     return ref(database, CURRENTMATCHREFNAME);
// }

export function bindListener<T>(reference: DatabaseReference, callback: (value: T | null) => void){
    onValue(reference, (snapshot) => {
        callback(snapshot.val());
    });
}

export function saveGame(reference: DatabaseReference, frcGame: FRCGame){
    reference
}

export async function persistData(database: Firestore, path: string, element: string, data: Object){
    try{
        const docRef = await setDoc(doc(database, path, element), data);
    }
    catch(e){
        console.error("Error adding document: " + e);
    }
    
}