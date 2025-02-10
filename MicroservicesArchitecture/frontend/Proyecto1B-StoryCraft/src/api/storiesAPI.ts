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
  const token = localStorage?.getItem("token");
  const response = await fetch("http://localhost:3000/stories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }

  const stories: Story[] = await response.json();
  return stories;
};

export const getStoryById = async (storyID: number): Promise<Story> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(`http://localhost:3000/stories/${storyID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch story");
  }

  const story: Story = await response.json();
  return story;
};

export const createStory = async (storyData: FormData): Promise<Story> => {
  const token = localStorage?.getItem("token");
  const response = await fetch("http://localhost:3000/stories", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: storyData,
  });

  if (!response.ok) {
    throw new Error("Failed to create story");
  }

  const newStory: Story = await response.json();
  return newStory;
};

export const createChapter = async (
  chapterData: FormData
): Promise<Chapter> => {
  const token = localStorage?.getItem("token");
  const response = await fetch("http://localhost:3000/chapters", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: chapterData,
  });

  if (!response.ok) {
    throw new Error("Failed to create chapter");
  }

  const newChapter: Chapter = await response.json();
  return newChapter;
};

export const createStoryWithImage = async (
  storyData: Partial<Story>,
  imageName: string | null
): Promise<Story> => {
  // Prepare story data with image path
  const storyDataWithImage = {
    ...storyData,
    ImagePath: imageName || "default-story-image.jpg",
  };

  // Use existing createStory method
  const formData = new FormData();
  Object.entries(storyDataWithImage).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  const newStory = await createStory(formData);
  return newStory;
};

export const getChaptersByStoryId = async (
  storyID: number
): Promise<Chapter[]> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(
    `http://localhost:3000/chapters/story/${storyID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chapters for the story");
  }

  const chapters: Chapter[] = await response.json();
  return chapters;
};

export const deleteStory = async (storyId: number): Promise<void> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(`http://localhost:3000/stories/${storyId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete story");
  }
};

export const deleteChapter = async (chapterId: number): Promise<void> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(`http://localhost:3000/chapters/${chapterId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete chapter");
  }
};

export const updateStory = async (
  storyId: number,
  storyData: FormData
): Promise<Story> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(`http://localhost:3000/stories/${storyId}`, {
    method: 'PATCH',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: storyData, 
  });

  if (!response.ok) {
    throw new Error("Failed to update story");
  }

  const updatedStory: Story = await response.json();
  return updatedStory;
};

export const updateChapter = async (
  chapterId: number, 
  chapterData: FormData
): Promise<Chapter> => {
  const token = localStorage?.getItem("token");
  const response = await fetch(`http://localhost:3000/chapters/${chapterId}`, {
    method: 'PATCH',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: chapterData, 
  });

  if (!response.ok) {
    throw new Error("Failed to update chapter");
  }

  const updatedChapter: Chapter = await response.json();
  return updatedChapter;
};