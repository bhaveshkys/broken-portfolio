// Strapi API Types
export interface StrapiCoverImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: {
    large?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
    medium?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
    small?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiPost {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover?: StrapiCoverImage;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}

// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage?: string;
  category?: string;
  categoryColor: string;
}

// App State Types
export interface SectionState {
  hero: boolean;
  about: boolean;
  projects: boolean;
  contact: boolean;
}

// CSS Challenge Types
export interface CSSChallenge {
  section: keyof SectionState;
  title: string;
  description: string;
  brokenCSS: string;
  correctCSS: string;
  hint: string;
}

// Component Props Types
export interface CyclingTextProps {
  words: string[];
  className?: string;
}