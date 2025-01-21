import React from 'react';
import { Chapter } from '../api/storiesAPI';
import { URL_IMAGE_STORY } from '../interfaces/stories';

interface ChaptersListProps {
    chapters: Chapter[];
    onChapterClick: (chapter: Chapter) => void;
}

const ChaptersList: React.FC<ChaptersListProps> = ({ 
    chapters, 
    onChapterClick 
}) => {
    if (chapters.length === 0) {
        return <p>No chapters yet</p>;
    }

    return (
        <div>
            <h6>Chapters</h6>
            <div className="row">
                {chapters.map(chapter => (
                    <div key={chapter.ChapterID} className="col-md-4 mb-3">
                        <button 
                            className="btn btn-outline-primary w-100"
                            onClick={() => onChapterClick(chapter)}
                        >
                            <div className="d-flex flex-column align-items-center">
                                <img 
                                    src={`${URL_IMAGE_STORY}${chapter.ImagePath}`} 
                                    alt={chapter.Title} 
                                    className="img-fluid mb-2"
                                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                                />
                                {chapter.Title}
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChaptersList;