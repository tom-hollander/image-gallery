import data from '../db/gallery-data';
import { PAGE_SIZE } from '../config';

/// Mock api
export class GalleryApi {
    getImages(currentPageCount) {
        const start = (currentPageCount - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data.slice(start, end));
            }, 200); 
        });
    }

    getImageCount(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(data.length);
            }, 200); 
        });
    }
}

export default new GalleryApi();
