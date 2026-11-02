export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalDocument {
  title: string;
  summary: string;
  sections: LegalSection[];
}
