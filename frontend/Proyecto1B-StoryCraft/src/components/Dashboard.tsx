import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { getStories, getStoryById, Story, Chapter, getChaptersByStoryId } from '../api/storiesAPI';
import Chat from "./Chat";
import CreateStory from './CreateStory';
import CreateStoryDrawer from './CreateStoryDrawer';

const Dashboard: React.FC = () => {
    const { username } = useAuth(); 

    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [selectedCreatedStory, setSelectedCreatedStory] = useState<Story | null>(null);
    const [isCreateStoryModalVisible, setIsCreateStoryModalVisible] = useState(false);
    const [storyChapters, setStoryChapters] = useState<Chapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setIsLoading(true);
                const fetchedStories = await getStories();
                setStories(fetchedStories);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch stories');
                setIsLoading(false);
            }
        };

        fetchStories();
    }, []);

    const handleStoryCreated = (story: Story) => {
        setSelectedCreatedStory(story);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
 
    const handleStoryClick = async (story: Story) => {
        try {
            // Fetch full story details
            const fullStoryDetails = await getStoryById(story.StoryID);
            setSelectedStory(fullStoryDetails);
            
            // Fetch chapters for the story
            const chapters = await getChaptersByStoryId(story.StoryID);
            setStoryChapters(chapters);
            
            // Reset other states
            setSelectedChapter(null);
            toggleDropdown(); // Close dropdown if it's open
        } catch (err) {
            console.error('Error fetching story details:', err);
        }
    };
 
    const toggleModal = () => {
        setIsOpen(false);
        setSelectedStory(null);
    };

    const handleCreateStory = (storyData: {
        title: string;
        genre: string;
        maturityRating: string;
        prologue: string;
        image: File | null;
    }) => {
        console.log('New story created:', storyData);
        
        if (storyData.image) {
            const formData = new FormData();
            formData.append('image', storyData.image);
        }
    };

    const handleChapterClick = (chapter: Chapter) => {
        setSelectedChapter(chapter);
    };

    const handleAddNewChapter = () => {
        if (selectedStory) {
            setSelectedCreatedStory(selectedStory);
        }
    };

    const closeStoryModal = () => {
        setSelectedStory(null);
        setSelectedChapter(null);
    };

    const closeChapterModal = () => {
        setSelectedChapter(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
      <div>
        <CreateStory 
          show={isCreateStoryModalVisible}
          onHide={() => setIsCreateStoryModalVisible(false)}
          onStoryCreated={handleStoryCreated}
        />

        {/* CreateStoryDrawer for adding chapters */}
        {selectedCreatedStory && (
          <CreateStoryDrawer
            show={!!selectedCreatedStory}
            onHide={() => setSelectedCreatedStory(null)}
            story={selectedCreatedStory}
          />
        )}

        <h1>Bienvenido al Dashboard</h1>
        {username ? (
          <>
            <p>Hola, {username}!</p>
            <Chat />
            
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button 
                        className="btn btn-primary"
                        onClick={() => setIsCreateStoryModalVisible(true)}
                    >
                        <i className="fas fa-plus"></i> Crear nueva historia
                    </button>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" onClick={toggleDropdown}>
                            Usuario
                        </button>
                        {isOpen && (
                            <div className="dropdown-menu show">
                                <a className="dropdown-item" href="#">Cerrar sesión</a>
                                <a className="dropdown-item" href="#">Cambiar contraseña</a>
                            </div>
                        )}
                    </div>
                </div>

                <h2 className="mb-3">Historias Globales</h2>

                <div className="d-flex flex-wrap justify-content-center">
                    {stories.map((story) => (
                        <div 
                            key={story.StoryID} 
                            className="card m-3" 
                            style={{ width: '18rem', cursor: 'pointer' }} 
                            onClick={() => handleStoryClick(story)}
                        >
                            <img 
                                src={`/images/${story.ImagePath}`} 
                                className="card-img-top" 
                                alt={story.Title} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{story.Title}</h5>
                                <p className="card-text">{story.Genre}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Story Details Modal */}
                {selectedStory && (
                    <div 
                        className="modal" 
                        style={{ 
                            display: 'block', 
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1000
                        }}
                    >
                        <div 
                            className="modal-dialog modal-lg" 
                            style={{ 
                                maxWidth: '800px',
                                margin: '50px auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px'
                            }}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedStory.Title}</h5>
                                    <button 
                                        type="button" 
                                        className="close" 
                                        onClick={closeStoryModal}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img 
                                                src={`/images/${selectedStory.ImagePath}`} 
                                                alt={selectedStory.Title} 
                                                className="img-fluid" 
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <p>{selectedStory.Description || 'No description available'}</p>
                                            <div>
                                                <h6>Chapters</h6>
                                                {storyChapters.length === 0 ? (
                                                    <p>No chapters yet</p>
                                                ) : (
                                                    storyChapters.map(chapter => (
                                                        <button 
                                                            key={chapter.ChapterID} 
                                                            className="btn btn-outline-primary m-1"
                                                            onClick={() => handleChapterClick(chapter)}
                                                        >
                                                            {chapter.Title}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleAddNewChapter}
                                    >
                                        Add New Chapter
                                    </button>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={closeStoryModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapter Content Modal */}
                {selectedChapter && (
                    <div 
                        className="modal" 
                        style={{ 
                            display: 'block', 
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1000
                        }}
                    >
                        <div 
                            className="modal-dialog modal-lg"
                            style={{ 
                                maxWidth: '800px',
                                margin: '50px auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px'
                            }}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedChapter.Title}</h5>
                                    <button 
                                        type="button" 
                                        className="close" 
                                        onClick={closeChapterModal}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {selectedChapter.Content}
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={closeChapterModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </>
        ) : (
          <p>Por favor, inicia sesión.</p>  
        )}
      </div>
    );
  };
  
export default Dashboard;