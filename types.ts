export interface TranslationData {
  translation: string;
  keywords: string[];
}

export interface TranslationState {
  data: TranslationData | null;
  isLoading: boolean;
  error: string | null;
}
