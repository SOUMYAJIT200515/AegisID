const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const multerImport = `import multer from "multer";\nconst upload = multer({ storage: multer.memoryStorage() });\n`;
if (!code.includes('multer')) {
  code = multerImport + code;
}

const originalPost = `app.post("/api/assets", (req, res) => {`;
const newPost = `app.post("/api/assets/upload", upload.single("file"), (req, res) => {
    // If multipart/form-data is used, fields are in req.body, file is in req.file
`;
code = code.replace(originalPost, newPost);

fs.writeFileSync('server.ts', code);
