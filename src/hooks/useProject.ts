import { useState, useEffect } from 'react';
import { ProjectDetails } from '../types';
import { getProjectDetails } from '../utils/projects';

export function useProject(slug: string | undefined) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!slug) {
        setProject(null);
        setIsLoading(false);
        return;
      }

      try {
        const projectData = await getProjectDetails(slug);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  return { project, isLoading };
}