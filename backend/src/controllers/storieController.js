import { getAllStories,createStory,getStoryByID,updateStoryByID,deleteStoryByID } from "../repositories/storieRepositorie.js";

export const getStories = async (req, res) => {
    try {
      const stories = await getAllStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Error fetching stories", cause: error });
    }
  };

export const addStory = async (req, res) => {
    const { Title, Description, AuthorID, Genre, MaturityRating, ImagePath } = req.body;
    try {
      const newStory = await createStory({
        Title,
        Description,
        AuthorID,
        Genre,
        MaturityRating,
        ImagePath,
      });
      res.status(201).json(newStory);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Error creating story", cause: error });
    }
  };
  
  export const getStory = async (req, res) => {
    try {
      const { storyID } = req.params;
      const story = await getStoryByID(storyID);
  
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
  
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Error fetching story", cause: error });
    }
  };

  export const updateStory = async (req, res) => {
    try {
      const { storyID } = req.params;
      const { Title, Description, Status, Genre, MaturityRating, ImagePath } = req.body;
  
      const updatedStory = await updateStoryByID(storyID, {
        Title,
        Description,
        Status,
        Genre,
        MaturityRating,
        ImagePath,
      });
  
      if (!updatedStory) {
        return res.status(404).json({ error: "Story not found" });
      }
  
      res.json(updatedStory);
    } catch (error) {
      console.error("Error updating story:", error);
      res.status(500).json({ error: "Error updating story", cause: error });
    }
  };

  export const deleteStory = async (req, res) => {
    try {
      const { storyID } = req.params;
  
      const deletedStory = await deleteStoryByID(storyID);
  
      if (!deletedStory) {
        return res.status(404).json({ error: "Story not found" });
      }
  
      res.json({ message: "Story deleted successfully" });
    } catch (error) {
      console.error("Error deleting story:", error);
      res.status(500).json({ error: "Error deleting story", cause: error });
    }
  };