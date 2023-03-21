import { extname } from "path";

export const editFileName = (req, file, callback) => {
    console.log(file,'test file')
  const clean_name = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const name = clean_name.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};