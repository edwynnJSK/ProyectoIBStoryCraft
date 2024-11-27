import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createChapter, Chapter, Story } from '../api/storiesAPI';

interface CreateStoryDrawerProps {
  show: boolean;
  onHide: () => void;
  story: Story;
}

const CreateStoryDrawer: React.FC<CreateStoryDrawerProps> = ({ 
  show, 
  onHide, 
  story 
}) => {
  const navigate = useNavigate();
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterDetails, setChapterDetails] = useState({
    title: '',
    content: ''
  });

  const [chapterImage, setChapterImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Reset chapter number when the component is first shown
  useEffect(() => {
    if (show) {
      setChapterNumber(1);
    }
  }, [show]);

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
      setChapterImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setChapterDetails({
      title: '',
      content: ''
    });
    setChapterImage(null);
    setImagePreview(null);
    setError('');
  };

  const handleCreateChapter = async () => {
    // Validate chapter details
    if (!chapterDetails.title || !chapterDetails.content) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {

      const formData = new FormData();
      formData.append('StoryID', story.StoryID.toString());
      formData.append('Title', chapterDetails.title);
      formData.append('Content', chapterDetails.content);
      formData.append('ChapterNumber', chapterNumber.toString());

      if (chapterImage) {
        formData.append('Image', chapterImage); 
      }

      await createChapter(formData);

      return true;
    } catch (err) {
      console.error('Error creating chapter:', err);
      setError('Error al crear el capítulo');
      return false;
    }
  };

  const handleAddAnotherChapter = async () => {
    // Try to create the current chapter
    const chapterCreated = await handleCreateChapter();
    
    if (chapterCreated) {
      // Increment chapter number and reset form fields
      setChapterNumber(prev => prev + 1);
      resetForm();
    }
  };

  const handleFinishAndClose = async () => {
    const chapterCreated = await handleCreateChapter();
    
    if (chapterCreated) {
      resetForm();
      onHide();
      navigate('/dashboard');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Capítulo {chapterNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título del Capítulo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={chapterDetails.title}
              onChange={handleChapterDetailsChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contenido del Capítulo</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={chapterDetails.content}
              onChange={handleChapterDetailsChange}
              rows={6}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del Capítulo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleChapterImageUpload}
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
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleFinishAndClose}
          disabled={!chapterDetails.title || !chapterDetails.content}
        >
          Crear Capítulo y Finalizar
        </Button>
        <Button 
          variant="success" 
          onClick={handleAddAnotherChapter}
          disabled={!chapterDetails.title || !chapterDetails.content}
        >
          Añadir Otro Capítulo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateStoryDrawer;