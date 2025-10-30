import React from 'react';
import { Chapter } from '../api/storiesAPI';
import { URL_IMAGE_STORY } from '../interfaces/stories';
import '../styles/ChaptersList.css';

interface ChaptersListProps {
    chapters: Chapter[];
    onChapterClick: (chapter: Chapter) => void;
}

const ChaptersList: React.FC<ChaptersListProps> = ({ 
    chapters, 
    onChapterClick 
}) => {
    if (chapters.length === 0) {
        return (
            <div className="chapters-empty">
                <div className="chapters-empty-icon">📑</div>
                <p>No hay capítulos disponibles</p>
            </div>
        );
    }

    return (
        <div className="chapters-container">
            <div className="chapters-header">
                <h6>📖 Capítulos</h6>
                <span className="chapters-count">{chapters.length}</span>
            </div>
            <div className="chapters-grid">
                {chapters.map(chapter => (
                    <div 
                        key={chapter.ChapterID} 
                        className="chapter-card"
                        onClick={() => onChapterClick(chapter)}
                    >
                        <img 
                            src={`${URL_IMAGE_STORY}${chapter.ImagePath}`} 
                            alt={chapter.Title} 
                            className="chapter-card-image"
                        />
                        <div className="chapter-card-body">
                            <h5 className="chapter-card-title">{chapter.Title}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChaptersList;