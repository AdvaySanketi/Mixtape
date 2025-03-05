import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    getDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Track {
    id: number;
    url: string;
}

export interface Mixtape {
    id: string;
    recipientName: string;
    tracks: Track[];
}

class MixtapeService {
    // Create a new mixtape
    static async createMixtape(mixtape: Omit<Mixtape, 'id' | 'createdAt'>) {
        try {
            const mixtapeWithTimestamp = {
                ...mixtape,
                createdAt: Date.now(),
            };

            const docRef = await addDoc(
                collection(db, 'mixtapes'),
                mixtapeWithTimestamp
            );
            return { ...mixtapeWithTimestamp, id: docRef.id };
        } catch (error) {
            console.error('Error creating mixtape:', error);
            throw error;
        }
    }

    // Get a mixtape by ID
    static async getMixtapeById(id: string): Promise<Mixtape | null> {
        try {
            const docRef = doc(db, 'mixtapes', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Mixtape;
            } else {
                console.warn(
                    `Mixtape with ID ${id} not found. Fetching default mixtape.`
                );
                return await MixtapeService.getMixtapeById('awesome-mix');
            }
        } catch (error) {
            console.error('Error fetching mixtape:', error);
            return null;
        }
    }

    // Update a mixtape by ID
    static async updateMixtape(id: string, updates: Partial<Mixtape>) {
        try {
            const docRef = doc(db, 'mixtapes', id);
            await updateDoc(docRef, updates);
            return await MixtapeService.getMixtapeById(id);
        } catch (error) {
            console.error('Error updating mixtape:', error);
            throw error;
        }
    }
}

export default MixtapeService;
