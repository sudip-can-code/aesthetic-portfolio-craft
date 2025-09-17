import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, GripVertical } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  image_url?: string;
  video_url?: string;
  display_order: number;
}

interface SortableProjectRowProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const SortableProjectRow = ({ project, onEdit, onDelete }: SortableProjectRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'z-50' : ''}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="h-12 w-20 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{project.title}</TableCell>
      <TableCell>{project.category}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(project.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SortableProjectRow;