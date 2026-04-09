import path from 'node:path';
import {randomUUID} from 'node:crypto';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve('src', 'tmp'));
  },
  filename: (_req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const uuid = randomUUID();
    cb(null, `${basename}.${uuid}${extname}`);
  },
});

export const upload = multer({storage});