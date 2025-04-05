import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useProject } from '../hooks/useProject';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { project, isLoading } = useProject(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-400">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* Hero Title */}
      <div className="w-full py-32 flex items-center justify-center">
        <h1 className="text-8xl font-bold tracking-tight">{project.title}</h1>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
        {/* Overview Section */}
        <section>
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-4xl font-bold">Overview</h2>
            <div className="h-px flex-1 bg-white/10 ml-8"></div>
          </div>
          <div className="prose prose-invert max-w-3xl text-xl leading-relaxed">
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </div>
        </section>
        
        {/* Tools Section */}
        <section>
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-4xl font-bold">Tools</h2>
            <div className="h-px flex-1 bg-white/10 ml-8"></div>
          </div>
          <div className="flex flex-wrap gap-4">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-6 py-3 bg-white/5 rounded-lg text-lg font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>
        
        {/* GitHub Section */}
        <section>
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-4xl font-bold">GitHub</h2>
            <div className="h-px flex-1 bg-white/10 ml-8"></div>
          </div>
          <div>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white/5 hover:bg-white/10 rounded-lg text-xl font-medium transition-colors"
            >
              <Github className="w-6 h-6 mr-3" />
              View on GitHub
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}