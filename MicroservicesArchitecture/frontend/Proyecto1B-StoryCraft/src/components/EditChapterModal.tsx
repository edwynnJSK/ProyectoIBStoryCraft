// src/components/EditChapterModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateChapter, Chapter, Story } from '../api/storiesAPI';

interface EditChapterModalProps {
  show: boolean;
  onHide: () => void;
  chapter: Chapter;
  story: Story;
  onChapterUpdated: (updatedChapter: Chapter) => void;
}

const EditChapterModal: React.FC<EditChapterModalProps> = ({ 
  show,
  onHide, 
  chapter,
  onChapterUpdated
}) => {
  const [chapterDetails, setChapterDetails] = useState({
    title: '',
    content: ''
  });

  const [chapterImage, setChapterImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Populate form with existing chapter data when modal opens
  useEffect(() => {
    if (chapter) {
      setChapterDetails({
        title: chapter.Title || '',
        content: chapter.Content || ''
      });
      // Reset image-related states
      setImagePreview(`http://localhost:3000${chapter.ImagePath}`);
    }
  }, [chapter]);

  const handleChapterDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleUpdateChapter = async () => {
    // Validate chapter details
    if (!chapterDetails.title || !chapterDetails.content) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (chapter.ChapterID === undefined) {
        setError('Chapter ID is missing');
        return;
      }

    try {
      const formData = new FormData();
      formData.append('Title', chapterDetails.title);
      formData.append('Content', chapterDetails.content);
      formData.append('ChapterNumber', chapter.ChapterNumber.toString());


      if (chapterImage) {
        formData.append('Image', chapterImage);
      }

      const updatedChapter = await updateChapter(chapter.ChapterID, formData);
      
      // Call the callback to update the parent component
      onChapterUpdated(updatedChapter);
      
      // Close the modal
      onHide();
    } catch (err) {
      console.error('Error updating chapter:', err);
      setError('Error al actualizar el capítulo');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Capítulo {chapter?.ChapterNumber}</Modal.Title>
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
          onClick={handleUpdateChapter}
          disabled={!chapterDetails.title || !chapterDetails.content}
        >
          Actualizar Capítulo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditChapterModal;