import { expect, it } from "vitest";
import {getFilePathWithoutExtension} from '../src/shared/utils/getFilePathWithoutExt';

it('should return an empty string', () => {
    const path = '';
    expect(getFilePathWithoutExtension(path)).toEqual('');
})

it('should return the right string', () => {
    let path = 'book.svg';
    expect(getFilePathWithoutExtension(path)).toEqual('book');

    path = '/path/book.svg';
    expect(getFilePathWithoutExtension(path)).toEqual('/path/book');
})