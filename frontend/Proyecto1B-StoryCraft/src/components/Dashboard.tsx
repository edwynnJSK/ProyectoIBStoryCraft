import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { getStories } from '../api/storiesAPI';
import Chat from "./Chat";
import CreateStory from './CreateStory';

// Actualiza la interfaz para que coincida con tu modelo de backend
interface Story {
    StoryID: number;
    Title: string;
    ImagePath: string;
    Genre: string;
}

const Dashboard: React.FC = () => {
    const { username } = useAuth(); 

    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [isCreateStoryModalVisible, setIsCreateStoryModalVisible] = useState(false);
 
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

    const handleStoryCreated = (newStory: Story) => {
        // Añade la nueva historia al inicio de la lista
        setStories(prevStories => [newStory, ...prevStories]);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
 
    const handleStoryClick = (story: Story) => {
        setSelectedStory(story);
        toggleDropdown();
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
        // Here you can add logic to save the story, 
        // including handling the image upload
        console.log('New story created:', storyData);
        
        if (storyData.image) {
            // You might want to upload the image to your server here
            // This could involve using FormData or a specific upload method
            const formData = new FormData();
            formData.append('image', storyData.image);
            // Add other story details to formData as needed
        }
        
        // Optionally, refresh stories or add the new story to the list
    };

    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
      <div>
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

                {/* CreateStory Modal */}
                <CreateStory 
                show={isCreateStoryModalVisible}
                onHide={() => setIsCreateStoryModalVisible(false)}
                onStoryCreated={handleStoryCreated}  // Añade este prop
                />

                <h2 className="mb-3">Historias Globales</h2>

                {/* Rest of the Dashboard remains the same */}
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

                {/* Existing Story Modal */}
                {selectedStory && (
                    <div 
                        className="modal" 
                        style={{ 
                            display: 'block', 
                            backgroundColor: 'rgba(0,0,0,0.5)' 
                        }}
                    >
                        {/* ... existing modal content ... */}
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