export interface CreateStoryDto {
    Title: string;
    Description: string;
    AuthorID: number;
    Genre?: string;
    Status?: string;
    MaturityRating?: string;
    ImagePath? : string;
}