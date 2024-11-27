import prisma from '../prisma/client.js';

export const getAllStories = async () => {
    try {
      return prisma.stories.findMany();
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw new Error("Error fetching stories");
    }
  };
  
  export const createStory = async (data) => {
    try {
      return prisma.stories.create({
        data: {
          Title: data.Title,
          Description: data.Description || null,
          AuthorID: data.AuthorID,
          Status: data.Status || 'draft',
          Genre: data.Genre || null,
          MaturityRating: data.MaturityRating || null,
          ImagePath: data.ImagePath ,
        },
      });
    } catch (error) {
      console.error("Error creating story:", error);
      throw new Error("Error creating story");
    }
  };
  
  export const getStoryByID = async (storyID) => {
    try {
      return prisma.stories.findUnique({
        where: { StoryID: parseInt(storyID, 10) },
      });
    } catch (error) {
      console.error("Error fetching story:", error);
      throw new Error("Error fetching story");
    }
  };
  
  export const updateStoryByID = async (storyID, data) => {
    try {
      const filteredData = {};
      for (const key in data) {
        if (data[key] !== undefined) {
          filteredData[key] = data[key];
        }
      }
  
      return prisma.stories.update({
        where: { StoryID: parseInt(storyID, 10) },
        data: {
          ...filteredData,
          UpdatedAt: new Date(), 
        },
      });
    } catch (error) {
      console.error("Error updating story:", error);
      throw new Error("Error updating story");
    }
  };
  
  export const deleteStoryByID = async (storyID) => {
    try {
      return prisma.stories.delete({
        where: { StoryID: parseInt(storyID, 10) },
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      throw new Error("Error deleting story");
    }
  };