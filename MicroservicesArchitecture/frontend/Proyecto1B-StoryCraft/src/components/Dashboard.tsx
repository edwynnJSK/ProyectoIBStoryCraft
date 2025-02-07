import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getStories, getStoryById, Story, Chapter, getChaptersByStoryId, deleteStory } from '../api/storiesAPI';
import Chat from "./Chat";
import CreateStory from './CreateStory';
import CreateStoryDrawer from './CreateStoryDrawer';
import StoryDetailsModal from './StoryDetailsModal'; // New import
import EditStoryModal from './EditStoryModal'; // New import
import { URL_IMAGE_STORY } from '../interfaces/stories';
import ResetPassword from './ResetPassword';
import "../styles/Dashboard.css"


const Dashboard: React.FC = () => {
    const { username } = useAuth(); 
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [selectedCreatedStory, setSelectedCreatedStory] = useState<Story | null>(null);
    const [isCreateStoryModalVisible, setIsCreateStoryModalVisible] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [storyChapters, setStoryChapters] = useState<Chapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);

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

        // Fetch stories again to update the dashboard without full page reload
    const fetchStories = async () => {
        try {
            const fetchedStories = await getStories();
            setStories(fetchedStories);
        } catch (err) {
            setError('Failed to fetch stories');
        }
    };

    fetchStories();
    };

    // Add the handler for story updates:
    const handleStoryUpdated = async (updatedStory: Story) => {
        // Update the stories list
        const updatedStories = stories.map(story => 
        story.StoryID === updatedStory.StoryID ? updatedStory : story
        );
        setStories(updatedStories);

        // Update the selected story if it's currently being viewed
    if (selectedStory?.StoryID === updatedStory.StoryID) {
        setSelectedStory(updatedStory);
    }
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

    //codigo agregado para eliminar historia
    const handleDeleteStory = async (storyId: number) => {
        try {
            await deleteStory(storyId);
            // Refresh stories after deletion
            const fetchedStories = await getStories();
            setStories(fetchedStories);
            // Close the story modal
            setSelectedStory(null);
        } catch (error) {
            console.error('Failed to delete story:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
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

        {storyToEdit && (
        <EditStoryModal
            show={isEditModalVisible}
            onHide={() => {
            setIsEditModalVisible(false);
            setStoryToEdit(null);
            }}
            story={storyToEdit}
            onStoryUpdated={handleStoryUpdated}
        />
        )}

        <ResetPassword
          show={isResetPasswordModalVisible}
          onHide={() => setIsResetPasswordModalVisible(false)}
        />

        <h1>Bienvenido a StoryCraft</h1>
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
                                <a className="dropdown-item" onClick={handleLogout}>Cerrar sesión</a>
                                <a className="dropdown-item" onClick={() => setIsResetPasswordModalVisible(true)}>Cambiar contraseña</a>
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
                                src={`${URL_IMAGE_STORY}${story.ImagePath}`} 
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
                    <StoryDetailsModal
                        story={selectedStory}
                        chapters={storyChapters}
                        onClose={closeStoryModal}
                        onAddChapter={handleAddNewChapter}
                        onChapterClick={handleChapterClick}
                        onDeleteStory={handleDeleteStory} // Linea agrgada para eliminar historia
                        onEditStory={(story) => {
                            setStoryToEdit(story);
                            setIsEditModalVisible(true);
                          }}
                    />
                )}

                {/* Chapter Content Modal */}
                {selectedChapter && (
                    <div className="modal-overlay" >
                        <div  className="modal-content-custom modal-lg" >
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