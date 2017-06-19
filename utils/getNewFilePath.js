import path from 'path';

export default (img, params) => {
  const fileExtension = path.extname(img);
  const fileName = path.basename(img, fileExtension);
  const newFileName = `${fileName}-${params}.${fileExtension}`;
  const newFilePath = path.join(__dirname, '../public/uploads/', newFileName);
  return newFilePath;
};
