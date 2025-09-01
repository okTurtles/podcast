export interface Episode {
  episode: number;
  guid: string;
  title: string;
  subtitle?: string;
  permalink: string;
  src: string;
  filetype: string; // mimeType of the media file
  filesize: number; // file size of the media file in bytes
  coverImage?: string;
  duration: string;
  pubDate: string;
  tags: string[];
  epContent?: string;
}

export type TagDictionary = Record<string, Record<string, number>>
