import { Injectable } from '@nestjs/common';
import * as multer from 'multer';

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
}