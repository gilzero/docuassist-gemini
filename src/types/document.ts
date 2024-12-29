export interface DocumentElement {
  type: string;
  text: string;
  metadata?: Record<string, any>;
}

export interface ProcessedDocument {
  elements: DocumentElement[];
}

export interface AnalysisResponse {
  text: string;
  serverLocation?: {
    city?: string;
    region?: string;
    country?: string;
  };
}