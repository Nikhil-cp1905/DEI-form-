'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function submitFeedback(data: { alias: string; answers: Record<string, any> }) {
  if (!data.alias || !data.answers) {
    return { success: false, error: 'Invalid data provided.' };
  }

  try {
    await addDoc(collection(db, 'course_feedback'), {
      alias: data.alias,
      answers: data.answers,
      submittedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error writing document to Firestore: ", error);
    // In a real app, you might want to log this error to a monitoring service
    return { success: false, error: 'Could not connect to the database. Please try again later.' };
  }
}
