import {getAllChapters, getChapterByID,createChapter, updateChapterByID,deleteChapterByID} from '../repositories/chapterRepositorie.js'

export const getChapters = async (req, res) => {
    try {
      const chapters = await getAllChapters();
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ error: 'Error fetching chapters', cause: error });
    }
  };
  
  export const getChapter = async (req, res) => {
    const { chapterID } = req.params;
    try {
      const chapter = await getChapterByID(chapterID);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      res.status(200).json(chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      res.status(500).json({ error: 'Error fetching chapter', cause: error });
    }
  };
  
  export const addChapter = async (req, res) => {
    const { StoryID, Title, Content, ChapterNumber, ImagePath } = req.body;
    try {
      const newChapter = await createChapter(StoryID, Title, Content, ChapterNumber, ImagePath);
      res.status(201).json(newChapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ error: 'Error creating chapter', cause: error });
    }
  };
  
  export const updateChapter = async (req, res) => {
    const { chapterID } = req.params;
    const { Title, Content, ChapterNumber, ImagePath } = req.body;
    try {
      const updatedChapter = await updateChapterByID(chapterID, { Title, Content, ChapterNumber, ImagePath });
      if (!updatedChapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      res.status(200).json(updatedChapter);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating chapter', cause: error });
    }
  };
  
  export const deleteChapter = async (req, res) => {
    const { chapterID } = req.params;
    try {
      const deletedChapter = await deleteChapterByID(chapterID);
      if (!deletedChapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting chapter', cause: error });
    }
  };