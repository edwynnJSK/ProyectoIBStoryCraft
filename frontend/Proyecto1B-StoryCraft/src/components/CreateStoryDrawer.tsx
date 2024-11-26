import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { createStory, createChapter, Story } from '../api/storiesAPI';

interface CreateStoryDrawerProps {
  show: boolean;
  onHide: () => void;
  onStoryCreated?: (story: Story) => void;
}

interface ChapterDetails {
  chapterNumber: number;
  chapterTitle: string;
  chapterContent: string;
  selectedImage: File | null;
}

const CreateStoryDrawer: React.FC<CreateStoryDrawerProps> = ({ 
  show, 
  onHide, 
  onStoryCreated 
}) => {
  const { userID } = useAuth();

  // Story details state
  const [storyDetails, setStoryDetails] = useState({
    title: '',
    genre: '',
    maturityRating: '',
    description: ''
  });

  // Chapter details state
  const [chapterDetails, setChapterDetails] = useState<ChapterDetails>({
    chapterNumber: 1,
    chapterTitle: '',
    chapterContent: '',
    selectedImage: null
  });

  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'story' | 'chapter'>('story');
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

  const handleChapterDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChapterDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChapterImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setChapterDetails(prev => ({
        ...prev,
        selectedImage: file
      }));
    }
  };

  const handleCreateStory = async () => {
    // Validate story details
    if (!storyDetails.title || !storyDetails.genre || !storyDetails.maturityRating) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      // Prepare story data
      const storyData = {
        Title: storyDetails.title,
        Description: storyDetails.description,
        Genre: storyDetails.genre,
        MaturityRating: storyDetails.maturityRating,
        AuthorID: userID,
        ImagePath: storyImage ? storyImage.name : 'default-story-image.jpg',
        Status: 'draft'
      };

      // Create story
      const newStory = await createStory(storyData);

      // If chapter details are provided, create the first chapter
      if (chapterDetails.chapterTitle && chapterDetails.chapterContent) {
        const chapterData = {
          StoryID: newStory.StoryID,
          Title: chapterDetails.chapterTitle,
          Content: chapterDetails.chapterContent,
          ChapterNumber: 1,
          ImagePath: chapterDetails.selectedImage 
            ? chapterDetails.selectedImage.name 
            : null
        };

        await createChapter(chapterData);
      }

      // Call the callback if provided
      onStoryCreated?.(newStory);

      // Reset and close
      resetForm();
      onHide();
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
    setChapterDetails({
      chapterNumber: 1,
      chapterTitle: '',
      chapterContent: '',
      selectedImage: null
    });
    setStoryImage(null);
    setImagePreview(null);
    setCurrentStep('story');
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
          {/* Story Details Form */}
          <div>
            <h5>Detalles de la Historia</h5>
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

            <h5 className="mt-4">Primer Capítulo (Opcional)</h5>
            <Form.Group className="mb-3">
              <Form.Label>Título del Capítulo</Form.Label>
              <Form.Control
                type="text"
                name="chapterTitle"
                value={chapterDetails.chapterTitle}
                onChange={handleChapterDetailsChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido del Capítulo</Form.Label>
              <Form.Control
                as="textarea"
                name="chapterContent"
                value={chapterDetails.chapterContent}
                onChange={handleChapterDetailsChange}
                rows={6}
              />
            </Form.Group>
          </div>
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

export default CreateStoryDrawer;