export const getFilePathWithoutExtension = (filePath: string) => {
    // Remove the last word after the last dot
    if (filePath.length === 0) return '';

    const splitedWordsByDot = filePath.split('.');
    splitedWordsByDot.pop();
    return splitedWordsByDot.join();
}