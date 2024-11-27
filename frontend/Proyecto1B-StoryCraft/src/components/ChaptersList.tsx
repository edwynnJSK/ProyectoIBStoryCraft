import React from 'react';
import { Chapter } from '../api/storiesAPI';

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
            <div className="chapters-container">
                {chapters.map(chapter => (
                    <button 
                        key={chapter.ChapterID} 
                        className="btn btn-outline-primary m-1"
                        onClick={() => onChapterClick(chapter)}
                    >
                        {chapter.Title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChaptersList;