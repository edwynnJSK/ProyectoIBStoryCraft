import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Story, updateStory } from '../api/storiesAPI';
import { useAuth } from "../context/AuthContext";

interface EditStoryModalProps {
  show: boolean;
  onHide: () => void;
  story: Story;
  onStoryUpdated: (story: Story) => void;
}

const EditStoryModal: React.FC<EditStoryModalProps> = ({ 
  show, 
  onHide, 
  story,
  onStoryUpdated
}) => {
  const { userID } = useAuth();
  const [storyDetails, setStoryDetails] = useState({
    title: '',
    genre: '',
    maturityRating: '',
    description: ''
  });
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (story) {
      setStoryDetails({
        title: story.Title || '',
        genre: story.Genre || '',
        maturityRating: story.MaturityRating || '',
        description: story.Description || ''
      });
      // Set image preview from existing story
      setImagePreview(`http://localhost:3000${story.ImagePath}`);
    }
  }, [story]);

  const handleStoryDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setStoryImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStory = async () => {
    try {
        setError(''); // Reset error state
        
        const updateData: Partial<Story> = {
            Title: storyDetails.title,
            Description: storyDetails.description,
            Genre: storyDetails.genre,
            MaturityRating: storyDetails.maturityRating,
            // Include any other fields that need updating
        };
  
        const updatedStory = await updateStory(story.StoryID, updateData);
        
        if (!updatedStory) {
            throw new Error('Failed to update story');
        }

        // Update the story in parent components
        onStoryUpdated(updatedStory);
        onHide();
    } catch (err) {
        console.error('Error updating story:', err);
        setError('Error al actualizar la historia. Por favor, intente nuevamente.');
    }
};

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Historia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título de la Historia</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={storyDetails.title}
              onChange={handleStoryDetailsChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={storyDetails.description}
              onChange={handleStoryDetailsChange}
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="genre"
              value={storyDetails.genre}
              onChange={handleStoryDetailsChange}
              required
            >
              <option value="">Seleccione un género</option>
              <option value="Fantasy">Fantasía</option>
              <option value="Sci-Fi">Ciencia Ficción</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Misterio</option>
              <option value="Adventure">Aventura</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Clasificación de Madurez</Form.Label>
            <Form.Select
              name="maturityRating"
              value={storyDetails.maturityRating}
              onChange={handleStoryDetailsChange}
              required
            >
              <option value="">Seleccione clasificación</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen de Portada</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleStoryImageUpload}
            />
            {imagePreview && (
              <div className="mt-2 text-center">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleUpdateStory}
          disabled={!storyDetails.title || !storyDetails.genre || !storyDetails.maturityRating}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStoryModal;