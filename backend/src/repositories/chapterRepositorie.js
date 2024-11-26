import prisma from '../prisma/client.js';

export const getAllChapters = async () => {
    try {
      return await prisma.chapters.findMany();
    } catch (error) {
      console.error("Error fetching all chapters:", error);
      throw new Error('Error fetching all chapters');
    }
  };
  
  export const getChapterByID = async (chapterID) => {
    try {
      return await prisma.chapters.findUnique({
        where: { ChapterID: parseInt(chapterID, 10) },
      });
    } catch (error) {
      console.error("Error fetching chapter by ID:", error);
      throw new Error('Error fetching chapter by ID');
    }
  };
  
  export const createChapter = async (storyID, title, content, chapterNumber, imagePath) => {
    try {
      return await prisma.chapters.create({
        data: {
          StoryID: storyID,
          Title: title,
          Content: content,
          ChapterNumber: chapterNumber,
          ImagePath: imagePath || 'default-chapter-image.jpg', 
        },
      });
    } catch (error) {
      console.error("Error creating chapter:", error);
      throw new Error('Error creating chapter');
    }
  };
  
  export const updateChapterByID = async (chapterID, data) => {
    try {
      const filteredData = {};
      for (const key in data) {
        if (data[key] !== undefined) {
          filteredData[key] = data[key];
        }
      }
      return await prisma.chapters.update({
        where: { ChapterID: parseInt(chapterID, 10) },
        data: filteredData,
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw new Error('Error updating chapter');
    }
  };
  
  export const deleteChapterByID = async (chapterID) => {
    try {
      return await prisma.chapters.delete({
        where: { ChapterID: parseInt(chapterID, 10) },
      });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      throw new Error('Error deleting chapter');
    }
  };