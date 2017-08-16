export * from  './file-select';
export * from  './file-drop';
export * from  './file-uploader';

import {FileSelect} from './file-select';
import {FileDrop} from './file-drop';

export const FILE_UPLOAD_DIRECTIVES: [any] = [FileSelect, FileDrop];
