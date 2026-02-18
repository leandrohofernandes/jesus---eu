import { UserProfile } from "../types";

// NOTE: In a production environment, this would be a fetch call to a Google App Script Web App
// that acts as an interface to the actual Google Sheet.
// For now, we simulate the "Sheet" persistence using a separate LocalStorage key acting as the DB.

const DB_KEY = 'google_sheet_db_simulation';

export const sheetService = {
  // Simulates: Consulting the sheet to see if the row exists
  findUserByName: async (name: string): Promise<UserProfile | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const dbString = localStorage.getItem(DB_KEY);
    const db: UserProfile[] = dbString ? JSON.parse(dbString) : [];

    const user = db.find(u => u.name.toLowerCase() === name.toLowerCase());
    return user || null;
  },

  // Simulates: Adding a new line to the sheet
  createUser: async (profile: UserProfile): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const dbString = localStorage.getItem(DB_KEY);
    const db: UserProfile[] = dbString ? JSON.parse(dbString) : [];

    // Assign an ID based on "row number"
    const newProfile = { ...profile, id: (db.length + 1).toString() };
    
    db.push(newProfile);
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    return newProfile;
  },

  // Simulates: Updating a specific cell/row
  updateUser: async (profile: UserProfile): Promise<void> => {
    const dbString = localStorage.getItem(DB_KEY);
    const db: UserProfile[] = dbString ? JSON.parse(dbString) : [];

    const index = db.findIndex(u => u.name === profile.name);
    if (index !== -1) {
      db[index] = profile;
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  }
};