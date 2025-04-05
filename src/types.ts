export interface Project {
  title: string;
  slug: string;
  tools: string[];
  github: string;
  date: string;
}

export interface ProjectDetails extends Project {
  description: string;
  thumbnailUrl: string;
  screenshots: string[];
}