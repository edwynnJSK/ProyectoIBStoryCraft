import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '../api/storiesAPI';
import { URL_IMAGE_STORY } from '../interfaces/stories';
import ChaptersList from './ChaptersList';
import { getChaptersByStoryId } from '../api/storiesAPI';
import "../styles/StoryDetailsModal.css";

interface StoryDetailsModalProps {
    story: Story;
    chapters: Chapter[];
    onClose: () => void;
    onAddChapter: () => void;
    onChapterClick: (chapter: Chapter) => void;
    onDeleteStory: (storyID: number) => void;  // New prop for deletion
    onEditStory: (story: Story) => void;
    onStoryUpdated: (story: Story) => void; // Add this prop for updating story
}

const StoryDetailsModal: React.FC<StoryDetailsModalProps> = ({
    story,
    onClose,
    onAddChapter,
    onChapterClick,
    onDeleteStory,
    onEditStory,   // New prop for deletion
    onStoryUpdated
}) => {
    const [currentStory, setCurrentStory] = useState<Story>(story); // New state for story
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    

    // Efecto para actualizar la historia actual
    useEffect(() => {
        setCurrentStory(story);
    }, [story]);
    
    // Nuevo manejador para actualizar la historia
    const handleStoryUpdate = (updatedStory: Story) => {
        setCurrentStory(updatedStory);
        onStoryUpdated(updatedStory); // Propaga la actualización al Dashboard
        onClose(); // Cierra el modal después de la actualización
    };

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setIsLoading(true);
                setError(null); // Reset error state
                const fetchedChapters = await getChaptersByStoryId(story.StoryID);
                
                // Check if fetchedChapters is null or undefined
                if (!fetchedChapters) {
                    throw new Error('No chapters found');
                }
                
                setChapters(fetchedChapters);
            } catch (err) {
                console.error('Failed to fetch chapters:', err);
                setError('No hay capítulos disponibles para esta historia');
            } finally {
                setIsLoading(false);
            }
        };

        if (story.StoryID) {
            fetchChapters();
        }
    }, [story.StoryID]);

    return (
        <div className="modal-overlay">
            <div className="modal-content-custom modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{currentStory.Title}</h5>   
                        {/* <h5 className="modal-title">{story.Title}</h5> */}
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                        >
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-4">
                                <img
                                    src={`${URL_IMAGE_STORY}${currentStory.ImagePath}`} // Changed to currentStory.ImagePath
                                    alt={currentStory.Title}
                                    className="img-fluid"
                                />
                                {/* <img
                                    src={`${URL_IMAGE_STORY}${story.ImagePath}`}
                                    alt={story.Title}
                                    className="img-fluid"
                                /> */}
                            </div>
                            <div className="col-md-8">
                                <p>{story.Description || 'No description available'}</p>
                                
                                {isLoading ? (
                                    <p>Cargando capítulos...</p>
                                ) : error ? (
                                    <p className="text-muted">{error}</p>
                                ) : chapters.length > 0 ? (
                                    <ChaptersList
                                        chapters={chapters}
                                        onChapterClick={onChapterClick}
                                    />
                                ) : (
                                    <p className="text-muted">Esta historia aún no tiene capítulos</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="btn btn-danger" // Changed to btn-danger for delete action
                            onClick={() => onDeleteStory(story.StoryID)}
                        >
                            Eliminar historia
                        </button>
                        <button
                            className="btn btn-warning"  // New edit button
                            onClick={() => onEditStory(currentStory)}   // Changed to currentStory
                            // onClick={() => onEditStory(story)}
                        >
                            Editar historia
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={onAddChapter}
                        >
                            Agregar nuevo capítulo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryDetailsModal;