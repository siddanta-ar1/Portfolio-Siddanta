export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image_url: string;
  image_urls?: string[];
  video_url?: string;
  links?: ProjectLink[];
}
