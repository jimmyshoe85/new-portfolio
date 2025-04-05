import { Project, ProjectDetails } from '../types';

export async function getProjects(): Promise<Project[]> {
  console.log('Loading projects...');
  
  try {
    // Use the correct path pattern for your folder structure
    const projectFiles = import.meta.glob('/projects/portfolio*/project.json');
    console.log('Project files found:', Object.keys(projectFiles));
    
    // Process the project files
    const projectData = await Promise.all(
      Object.entries(projectFiles).map(async ([path, loader]) => {
        try {
          const data = await loader() as { default: Project };
          console.log(`Loaded project from ${path}:`, data.default);
          
          return data.default;
        } catch (err) {
          console.error(`Error loading project from ${path}:`, err);
          return null;
        }
      })
    );
    
    // Filter out null values
    const validProjects = projectData.filter(Boolean) as Project[];
    console.log('Valid projects loaded:', validProjects);
    
    // Sort by date
    return validProjects.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
}

export async function getProjectDetails(slug: string): Promise<ProjectDetails | null> {
  console.log(`Loading details for project: ${slug}`);
  
  try {
    // Find all portfolio folders
    const projectFiles = import.meta.glob('/projects/portfolio*/project.json');
    
    // Find the matching project folder
    let projectFolder = null;
    
    // Check each portfolio folder to find the one with the matching slug
    for (const [path, loader] of Object.entries(projectFiles)) {
      try {
        const data = await loader() as { default: Project };
        if (data.default.slug === slug) {
          projectFolder = path.replace('/project.json', '');
          console.log(`Found matching project with slug '${slug}' in folder: ${projectFolder}`);
          break;
        }
      } catch (err) {
        console.error(`Error checking project at ${path}:`, err);
      }
    }
    
    if (!projectFolder) {
      console.error(`No matching project found for slug: ${slug}`);
      return null;
    }
    
    // Now load the project details from the found folder
    const projectJson = await import(`${projectFolder}/project.json`);
    
    // Load details.md content using fetch instead of import
    let description = "";
    try {
      const response = await fetch(`${projectFolder}/details.md`);
      if (response.ok) {
        description = await response.text();
        console.log("Successfully loaded details.md with fetch");
      } else {
        console.error(`Failed to fetch details.md: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError) {
      console.error("Error fetching details.md:", fetchError);
    }
    
    // Use thumbnail.png from the project folder
    const thumbnailUrl = `${projectFolder}/thumbnail.png`;
    
    // Get screenshot paths
    const screenshots = Array.from({ length: 6 }, (_, i) => 
      `${projectFolder}/shot${i + 1}.png`
    );
    
    return {
      ...projectJson.default,
      description: description,
      thumbnailUrl: thumbnailUrl,
      screenshots: screenshots
    };
  } catch (error) {
    console.error('Error loading project details:', error);
    return null;
  }
}