// Local storage for persisting edited results

const STORAGE_KEY = 'coolhacks_edited_results';

export interface EditedResult {
  indexNumber: string;
  name: string;
  school: string;
  year: number;
  subjects: Array<{
    code: string;
    name: string;
    grade: string;
    points: number;
  }>;
  meanGrade: string;
  totalPoints: number;
  lastModified: number;
}

export const saveEditedResult = (result: EditedResult): void => {
  try {
    const existing = getEditedResults();
    existing[result.indexNumber] = {
      ...result,
      lastModified: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getEditedResults = (): Record<string, EditedResult> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

export const getEditedResult = (indexNumber: string): EditedResult | null => {
  const results = getEditedResults();
  return results[indexNumber] || null;
};

export const deleteEditedResult = (indexNumber: string): void => {
  try {
    const existing = getEditedResults();
    delete existing[indexNumber];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
  }
};

export const clearAllEditedResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
