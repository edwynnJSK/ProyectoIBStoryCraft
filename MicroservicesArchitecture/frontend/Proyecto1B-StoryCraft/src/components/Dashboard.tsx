import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getStories, getStoryById, Story, Chapter, getChaptersByStoryId, deleteStory, deleteChapter } from '../api/storiesAPI';
import Chat from "./Chat";
import CreateStory from './CreateStory';
import CreateStoryDrawer from './CreateStoryDrawer';
import StoryDetailsModal from './StoryDetailsModal'; 
import EditStoryModal from './EditStoryModal'; 
import EditChapterModal from './EditChapterModal';
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
    const [isEditChapterModalVisible, setIsEditChapterModalVisible] = useState(false);
    const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);

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
        try {
            // Actualizar la historia en la lista de historias
            setStories(prevStories =>
                prevStories.map(story =>
                    story.StoryID === updatedStory.StoryID ? updatedStory : story
                )
            );

            // Actualizar la historia seleccionada si está siendo visualizada
            if (selectedStory?.StoryID === updatedStory.StoryID) {
                setSelectedStory(updatedStory);
            }

            // Cerrar los modales
            setIsEditModalVisible(false);
            setStoryToEdit(null);
            setSelectedStory(null);

            // Forzar una actualización de la lista completa
            const fetchedStories = await getStories();
            setStories(fetchedStories);
        } catch (err) {
            console.error('Error updating story list:', err);
            setError('Failed to update stories');
        }
    };

    const handleEditChapter = (chapter: Chapter) => {
        setChapterToEdit(chapter);
        setIsEditChapterModalVisible(true);
      };

    const handleChapterUpdated = async () => {
        // Update chapters list if the current story is selected
        if (selectedStory) {
          const updatedChapters = await getChaptersByStoryId(selectedStory.StoryID);
          setStoryChapters(updatedChapters);
        }
        
        // Close the chapter modal
        setSelectedChapter(null);
      };

    const toggleDropdown = () => setIsOpen(!isOpen);
 
    const handleStoryClick = async (story: Story) => {
        try {
            
            // Fetch full story details
            const fullStoryDetails = await getStoryById(story.StoryID);
            
            // Usar los detalles más recientes
            setSelectedStory(fullStoryDetails);
            
            // Fetch chapters for the story
            const chapters = await getChaptersByStoryId(story.StoryID);
            setStoryChapters(chapters);
            
            // Reset other states
            setSelectedChapter(null);
            toggleDropdown();
        } catch (err) {
            console.error('Error fetching story details:', err);
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

    const handleChapterCreated = async () => {
        if (selectedStory) {
          const updatedChapters = await getChaptersByStoryId(selectedStory.StoryID);
          setStoryChapters(updatedChapters);
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

    // In Dashboard.tsx, add a new handler method
    const handleDeleteChapter = async (chapterId: number) => {
        try {
        await deleteChapter(chapterId);
        
        // If a story is currently selected, refresh its chapters
        if (selectedStory) {
            const updatedChapters = await getChaptersByStoryId(selectedStory.StoryID);
            setStoryChapters(updatedChapters);
        }
        
        // Close the chapter modal
        setSelectedChapter(null);
        } catch (error) {
        console.error('Failed to delete chapter:', error);
        // Optionally, show an error message to the user
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
        return (
            <div className="dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando historias...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <h3>Error: {error}</h3>
                </div>
            </div>
        );
    }
    
    return (
      <div className="dashboard">
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
            onChapterCreated={handleChapterCreated}
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

        <div className="dashboard-header">
          <h1>📚 StoryCraft</h1>
          {username && <p>Bienvenido, {username}!</p>}
        </div>

        {username ? (
          <>
            <Chat />
            
            <div>
                <div className="dashboard-toolbar">
                    <button 
                        className="btn btn-primary btn-create-story"
                        onClick={() => setIsCreateStoryModalVisible(true)}
                    >
                        <i className="fas fa-plus"></i> Crear Nueva Historia
                    </button>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" onClick={toggleDropdown}>
                            👤 Usuario
                        </button>
                        {isOpen && (
                            <div className="dropdown-menu show">
                                <a className="dropdown-item" onClick={handleLogout}>🚪 Cerrar sesión</a>
                                <a className="dropdown-item" onClick={() => setIsResetPasswordModalVisible(true)}>🔑 Cambiar contraseña</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="stories-section">
                    <h2>Historias Globales</h2>

                    {stories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📖</div>
                            <h3>No hay historias disponibles</h3>
                            <p>¡Sé el primero en crear una historia!</p>
                        </div>
                    ) : (
                        <div className="story-list">
                            {stories.map((story) => (
                                <div 
                                    key={story.StoryID} 
                                    className="card" 
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
                    )}
                </div>

                {/* Story Details Modal */}
                {selectedStory && (
                <StoryDetailsModal
                    story={selectedStory}
                    chapters={storyChapters}
                    onClose={closeStoryModal}
                    onAddChapter={handleAddNewChapter}
                    onChapterClick={handleChapterClick}
                    onDeleteStory={handleDeleteStory}
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
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={() => handleDeleteChapter(selectedChapter.ChapterID!)}
                                    >
                                        Eliminar Capítulo
                                    </button>
                                    <button 
                                    className="btn btn-warning" 
                                    onClick={() => handleEditChapter(selectedChapter)}
                                    >
                                    Editar Capítulo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* EditChapterModal */}
                {chapterToEdit && selectedStory && (
                    <EditChapterModal
                    show={isEditChapterModalVisible}
                    onHide={() => {
                        setIsEditChapterModalVisible(false);
                        setChapterToEdit(null);
                    }}
                    chapter={chapterToEdit}
                    story={selectedStory}
                    onChapterUpdated={handleChapterUpdated}
                    />
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