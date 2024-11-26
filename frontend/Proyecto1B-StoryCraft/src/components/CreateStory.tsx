import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createStoryWithImage } from '../api/storiesAPI';
import { Story } from '../api/storiesAPI';
import CreateStoryDrawer from './CreateStoryDrawer';

interface CreateStoryProps {
  show: boolean;
  onHide: () => void;
  onStoryCreated?: (story: Story) => void;
}

const CreateStory: React.FC<CreateStoryProps> = ({ 
  show, 
  onHide, 
  onStoryCreated 
}) => {
  const { userID } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [maturityRating, setMaturityRating] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [isCreateStoryDrawerVisible, setIsCreateStoryDrawerVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userID) {
      setError('You must be logged in to create a story');
      return;
    }

    try {
      // Preparar FormData para enviar imagen y datos
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Description', description || '');
      formData.append('Genre', genre || '');
      formData.append('MaturityRating', maturityRating || '');
      formData.append('AuthorID', userID.toString());
      
      // Añadir imagen si está presente
      if (image) {
        formData.append('image', image);
      }

      // Llamar a una nueva función para manejar la subida con FormData
      const newStory = await createStoryWithImage(formData);

      // Limpiar formulario
      setTitle('');
      setDescription('');
      setGenre('');
      setMaturityRating('');
      setImage(null);
      setError('');

      // Llamar al callback
      onStoryCreated?.(newStory);
      
      // Cerrar modal
      onHide();
    } catch (err) {
      setError('Failed to create story');
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!show) return null;

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Story</h5>
            <button type="button" className="close" onClick={onHide}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select
                  className="form-control"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Romance">Romance</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>
              <div className="form-group">
                <label>Maturity Rating</label>
                <select
                  className="form-control"
                  value={maturityRating}
                  onChange={(e) => setMaturityRating(e.target.value)}
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cover Image</label>
                <input
                  type="file"
                  className="form-control-file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button 
                  type="button"  // Cambia de 'submit' a 'button' para evitar enviar el formulario
                  className="btn btn-primary"
                  onClick={() => setIsCreateStoryDrawerVisible(true)}
                >
                  Create Story
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CreateStoryDrawer 
        show={isCreateStoryDrawerVisible}
        onHide={() => setIsCreateStoryDrawerVisible(false)}
        onStoryCreated={(newStory) => {
          // Puedes manejar la creación de la historia aquí si es necesario
          onStoryCreated?.(newStory);
          setIsCreateStoryDrawerVisible(false);
        }}
      />
    </div>
  );
};

export default CreateStory;