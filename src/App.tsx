import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Code2, Github } from 'lucide-react';
import { ProjectDetails } from './types';
import ProjectDetail from './pages/ProjectDetail';
import { getProjects } from './utils/projects';

// Default fallback image URL
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070";

function App() {
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectData = await getProjects();
        console.log('Loaded projects in App.tsx:', projectData);
        
        // Log each project's thumbnail URL for debugging
        projectData.forEach(project => {
          console.log(`Project ${project.title} thumbnail: ${project.thumbnailUrl}`);
        });
        
        setProjects(projectData);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Set fallback project data
        setProjects([{
          title: "DevConnect",
          slug: "devconnect",
          tools: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
          github: "https://github.com/jamesmanning/devconnect",
          date: "2025-04-05",
          description: "A social platform for developers to connect and collaborate",
          thumbnailUrl: DEFAULT_IMAGE_URL,
          screenshots: []
        }]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="w-8 h-8 text-blue-500" />
              <Link to="/" className="text-2xl font-bold hover:text-blue-500 transition-colors">
                James A. Manning
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
              <Link to="/#projects" className="hover:text-blue-500 transition-colors">Projects</Link>
              <a href="#" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Low/No-Code Developer</h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
          An explorer at the intersection of AI and web development. As a low/no-code enthusiast, 
      I'm building experimental web apps to understand AI-assisted coding and discover how these
      emerging technologies can transform traditional development workflows into something
      more accessible and creative.
          </p>
          <a
            href="https://github.com/jimmyshoe85"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5 mr-2" />
            View on GitHub
          </a>
        </div>
      </section>

      <Routes>
        <Route
          path="/"
          element={
            <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold mb-8">Popular Projects</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-xl text-gray-400">No projects found in the projects directory.</p>
                  <p className="text-gray-500 mt-2">
                    Make sure you have project folders with project.json and details.md files.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project.slug}
                      to={`/project/${project.slug}`}
                      className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-900 transition-transform hover:scale-105"
                    >
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-30"
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully: ${project.thumbnailUrl}`);
                        }}
                        // Comment out the error handler to see if that's causing issues
                        // onError={(e) => {
                        //   console.error(`❌ Image failed to load: ${project.thumbnailUrl}`);
                        //   // If the thumbnail fails to load, use a backup image
                        //   (e.target as HTMLImageElement).src = DEFAULT_IMAGE_URL;
                        // }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                        <div className="absolute bottom-0 p-6">
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-1 text-sm bg-blue-600/30 rounded-full"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                          {project.description && (
                            <p className="text-gray-300 text-sm line-clamp-2">
                              {typeof project.description === 'string' && project.description.substring(0, 120)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          }
        />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
}

export default App;