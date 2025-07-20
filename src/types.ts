type FileType = 'audio' | 'video' | string

export interface Episode {
  episode: number;
  title: string;
  subtitle?: string;
  permalink: string;
  src: string;
  filetype: FileType;
  coverImage?: string;
  duration: string;
  pubDate: string;
  tags: string[];
  epContent?: string;
}
