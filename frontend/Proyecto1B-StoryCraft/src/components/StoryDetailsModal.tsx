import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '../api/storiesAPI';
import { URL_IMAGE_STORY } from '../interfaces/stories';
import ChaptersList from './ChaptersList';
import { getChaptersByStoryId } from '../api/storiesAPI';
import './StoryDetailsModal.css';

interface StoryDetailsModalProps {
    story: Story;
    onClose: () => void;
    onAddChapter: () => void;
    onChapterClick: (chapter: Chapter) => void;
}

const StoryDetailsModal: React.FC<StoryDetailsModalProps> = ({
    story,
    onClose,
    onAddChapter,
    onChapterClick
}) => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setIsLoading(true);
                const fetchedChapters = await getChaptersByStoryId(story.StoryID);
                setChapters(fetchedChapters);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch chapters:', error);
                setError('Failed to load chapters');
                setIsLoading(false);
            }
        };

        fetchChapters();
    }, [story.StoryID]);

    return (
        <div className="modal-overlay">
            <div className="modal-content-custom modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{story.Title}</h5>
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
                                    src={`${URL_IMAGE_STORY}${story.ImagePath}`}
                                    alt={story.Title}
                                    className="img-fluid"
                                />
                            </div>
                            <div className="col-md-8">
                                <p>{story.Description || 'No description available'}</p>
                                
                                {isLoading ? (
                                    <p>Loading chapters...</p>
                                ) : error ? (
                                    <p className="text-danger">{error}</p>
                                ) : (
                                    <ChaptersList
                                        chapters={chapters}
                                        onChapterClick={onChapterClick}
                                    />
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