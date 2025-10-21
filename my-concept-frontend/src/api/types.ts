export type ID = string; // Generic ID type

// --- Categorizing Concept Types ---
export interface Tag {
  name: string;
  type: string;
  reason: string;
}

export interface FicCategoryDoc {
  _id: ID;
  suggestedTags: Tag[];
  tagsToRemove: Tag[];
}

// --- Library Concept Types ---
export interface DateSpec {
  day: number;
  month: number;
  year: number;
}

export interface Fic {
  _id: ID;
  name: string;
  text: string;
  authorTags: string;
  date: DateSpec;
  versionNumber: number;
}

export interface Version {
  _id: ID;
  title: string;
  fics: Fic[];
}

// --- UserAuthentication Concept Types ---
// No specific types needed beyond ID for user
