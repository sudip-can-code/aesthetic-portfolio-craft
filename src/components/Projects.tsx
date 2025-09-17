import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, X } from 'lucide-react';
import { useRealtimeProjects } from '@/hooks/useRealtimeProjects';

type Project = {
  id: string;
  category: string;
  image_url: string;
  title: string;
  video_url?: string;
};

const CATEGORIES = ['ALL', 'CORPORATE', 'COMMERCIAL', 'REELS', 'MOTION GRAPHICS', 'THUMBNAIL', 'DESIGN', 'CINEMATIC', 'YOUTUBE VIDEO'];

const getYouTubeThumbnail = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  if (url.includes('youtube.com/shorts/') || url.includes('www.youtube.com/shorts/')) {
    const videoId = url.split('/shorts/')[1].split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
};

const ProjectCard = ({ project, index, onVideoPlay, onExternalLink }: { 
  project: Project; 
  index: number;
  onVideoPlay: (videoUrl: string, title: string) => void;
  onExternalLink: (url: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  const handleClick = () => {
    if (project.video_url) {
      // Check if it's a YouTube, Vimeo, or other video platform URL
      const isVideoUrl = project.video_url.includes('youtube.com') || 
                        project.video_url.includes('youtu.be') || 
                        project.video_url.includes('vimeo.com') ||
                        project.video_url.includes('.mp4') ||
                        project.video_url.includes('.webm') ||
                        project.video_url.includes('.ogg');
      
      if (isVideoUrl) {
        onVideoPlay(project.video_url, project.title);
      } else {
        onExternalLink(project.video_url);
      }
    }
  };

  // Use YouTube thumbnail if available, otherwise use uploaded image
  const thumbnailUrl = project.video_url ? getYouTubeThumbnail(project.video_url) : null;
  const displayImage = thumbnailUrl || project.image_url || '/placeholder.svg';
  
  return (
    <div 
      ref={cardRef}
      className={`project-card bg-secondary/20 ${
        project.category === 'REELS' ? 'aspect-[9/16]' : 'aspect-video'
      } transition-all duration-700 cursor-pointer relative ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      onClick={handleClick}
    >
      <div className="absolute inset-0">
        <img
          src={displayImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="text-xs uppercase tracking-wider mb-2">{project.category}</p>
          <h3 className="text-lg font-medium mb-4">{project.title}</h3>
          {project.video_url && (
            <div className="flex justify-center gap-2">
              {(project.video_url.includes('youtube.com') || 
                project.video_url.includes('youtu.be') || 
                project.video_url.includes('vimeo.com') ||
                project.video_url.includes('.mp4') ||
                project.video_url.includes('.webm') ||
                project.video_url.includes('.ogg')) ? (
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Play Video
                </Button>
              ) : (
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoModal = ({ isOpen, onClose, videoUrl, title }: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}) => {
  const getEmbedUrl = (url: string) => {
    // YouTube URL conversion
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Vimeo URL conversion
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    // Direct video files
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = videoUrl.includes('.mp4') || videoUrl.includes('.webm') || videoUrl.includes('.ogg');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
        <div className="relative w-full h-full bg-black">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="w-full h-full">
            {isDirectVideo ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { projects, loading } = useRealtimeProjects();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({ url: '', title: '' });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleVideoPlay = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
    setIsVideoModalOpen(true);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredProjects = activeCategory === 'ALL' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <>
      <section id="projects" ref={sectionRef} className="section bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-muted-foreground">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProjects.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index} 
                    onVideoPlay={handleVideoPlay}
                    onExternalLink={handleExternalLink}
                  />
                ))}
              </div>
            )}

            <div className={`flex justify-center flex-wrap gap-x-6 gap-y-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-sm py-1 px-2 transition-colors ${
                    activeCategory === category
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  } relative group`}
                >
                  {category}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform ${
                    activeCategory === category ? 'scale-x-100' : 'scale-x-0'
                  } group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={selectedVideo.url}
        title={selectedVideo.title}
      />
    </>
  );
};

export default Projects;
