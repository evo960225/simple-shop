import formidable from 'formidable';
export async function formToJson(req) {
  const form = new formidable.IncomingForm();
  const data = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(fields);
    });
  });
  return data
}