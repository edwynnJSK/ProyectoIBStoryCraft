import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImageUploader {
  static getImageUploader() {
    const storage = multer.diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    return storage;
  }

  static deleteOldImage(imagePath: string) {
    if (!imagePath || imagePath === '/images/default-story-image.jpg') {
      return;
    }

    try {
      const absolutePath = path.join('public', imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`Imagen eliminada: ${absolutePath}`);
      }
    } catch (error) {
      console.error(`Error deleting old image: ${error.message}`);
    }
  }
}
