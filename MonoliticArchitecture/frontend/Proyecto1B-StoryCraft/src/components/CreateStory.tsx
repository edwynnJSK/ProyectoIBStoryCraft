import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { createStory, Story } from '../api/storiesAPI';

interface CreateStoryProps {
  show: boolean;
  onHide: () => void;
  onStoryCreated: (story: Story) => void;
  onDashboardRefresh?: () => void;  // New prop for dashboard refresh
}

const CreateStory: React.FC<CreateStoryProps> = ({ 
  show, 
  onHide, 
  onStoryCreated,
  onDashboardRefresh  // Add new prop 
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

  const handleCreateStory = async () => {
    // Validate story details
    if (!storyDetails.title || !storyDetails.genre || !storyDetails.maturityRating) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Title', storyDetails.title);
      formData.append('Description', storyDetails.description);
      formData.append('Genre', storyDetails.genre);
      formData.append('MaturityRating', storyDetails.maturityRating);
      formData.append('AuthorID', userID.toString());
      formData.append('Status', 'draft');
      if (storyImage) {
        formData.append('Image', storyImage); 
      }

      const newStory = await createStory(formData);

      // Call the callback to move to next step
      onStoryCreated(newStory);
      
      // Trigger dashboard refresh if callback is provided
      onDashboardRefresh && onDashboardRefresh();
      
      onHide(); // Close the modal
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Error al crear la historia');
    }
  };

  const resetForm = () => {
    setStoryDetails({
      title: '',
      genre: '',
      maturityRating: '',
      description: ''
    });
    setStoryImage(null);
    setImagePreview(null);
    setError('');
  };

  const handleCancel = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear Nueva Historia</Modal.Title>
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
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCreateStory}
          disabled={!storyDetails.title || !storyDetails.genre || !storyDetails.maturityRating}
        >
          Crear Historia
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateStory;