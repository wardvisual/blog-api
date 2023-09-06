import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from 'fs'
import * as path from "path";

export const multerOptions = {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new HttpException(`Unsupported file type ${path.extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = 'uploads';
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
            cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
    }),
};