// src/api/storiesAPI.ts
export interface Story {
  StoryID: number;
  Title: string;
  ImagePath: string;
  Genre: string;
  Description?: string;
  Status?: string;
  AuthorID?: number;
  MaturityRating?: string;
}

export interface Chapter {
  ChapterID?: number;
  StoryID: number;
  Title: string;
  Content: string;
  ChapterNumber: number;
  ImagePath?: string | null;
}

export const getStories = async (): Promise<Story[]> => {
  const response = await fetch('http://localhost:3001/api/stories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }

  const stories: Story[] = await response.json();
  return stories;
};

export const getStoryById = async (storyID: number): Promise<Story> => {
  const response = await fetch(`http://localhost:3001/api/stories/${storyID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story');
  }

  const story: Story = await response.json();
  return story;
};

export const createStory = async (storyData: Partial<Story>): Promise<Story> => {
  const response = await fetch('http://localhost:3001/api/stories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });

  if (!response.ok) {
    throw new Error('Failed to create story');
  }

  const newStory: Story = await response.json();
  return newStory;
};

export const createChapter = async (chapterData: Partial<Chapter>): Promise<Chapter> => {
  const response = await fetch('http://localhost:3001/api/chapters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chapterData),
  });

  if (!response.ok) {
    throw new Error('Failed to create chapter');
  }

  const newChapter: Chapter = await response.json();
  return newChapter;
};

export const createStoryWithImage = async (storyData: Partial<Story>, imageName: string | null): Promise<Story> => {
  // Prepare story data with image path
  const storyDataWithImage = {
    ...storyData,
    ImagePath: imageName || 'default-story-image.jpg'
  };

  // Use existing createStory method
  const newStory = await createStory(storyDataWithImage);
  return newStory;
};