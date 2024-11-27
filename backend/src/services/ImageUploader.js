import multer from 'multer';
import path from 'path';

export const imageUploader = () => {
const storage = multer.diskStorage({
    destination: 'src/images/',
    filename: (req,file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); 
    },
  });
  const upload = multer({ storage });
  return upload
}
