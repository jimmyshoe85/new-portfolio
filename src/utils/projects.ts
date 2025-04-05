import { Project, ProjectDetails } from '../types';

export async function getProjects(): Promise<Project[]> {
  const projects = import.meta.glob('/projects/*/project.json');
  const projectData = await Promise.all(
    Object.entries(projects).map(async ([path, loader]) => {
      const data = await loader() as { default: Project };
      return data.default;
    })
  );
  return projectData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getProjectDetails(slug: string): Promise<ProjectDetails | null> {
  try {
    const projectJson = await import(`/projects/${slug}/project.json`);
    const detailsMd = await import(`/projects/${slug}/details.md?raw`);
    
    return {
      ...projectJson.default,
      description: detailsMd.default,
      thumbnailUrl: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070`,
      screenshots: []
    };
  } catch (error) {
    console.error('Error loading project details:', error);
    return null;
  }
}