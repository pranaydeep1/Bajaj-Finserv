const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const port = 5000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

const userId = "Pranay_deep_korada_20052003"; // Hardcoded user_id

// POST /bfhl endpoint with file upload
app.post('/bfhl', upload.single('file'), (req, res) => {
  console.log('Received request body:', req.body);
  console.log('Received file:', req.file);

  let data;
  try {
    data = req.body.data ? JSON.parse(req.body.data) : req.body;
    console.log('Parsed data:', data);
  } catch (error) {
    console.error('Error parsing data:', error);
    return res.status(400).json({
      is_success: false,
      user_id: userId,
      message: "Invalid JSON format for 'data'."
    });
  }

  // Input validation
  if (!Array.isArray(data.data)) {
    console.error('Invalid input format. "data" is not an array:', data);
    return res.status(400).json({
      is_success: false,
      user_id: userId,
      message: "Invalid input format. 'data' should be an array."
    });
  }

  const numbers = [];
  const alphabets = [];
  const lowercaseAlphabets = [];

  data.data.forEach(item => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase()) {
        lowercaseAlphabets.push(item);
      }
    }
  });

  const highestAlphabet = alphabets.length > 0 
    ? [alphabets.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))[0]] 
    : [];

  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
    ? [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]]
    : [];

  let fileInfo = {
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null
  };

  if (req.file) {
    fileInfo = {
      file_valid: true,
      file_mime_type: req.file.mimetype,
      file_size_kb: Math.round(req.file.size / 1024).toString()
    };
  }

  const response = {
    is_success: true,
    user_id: userId,
    email: "pranaydeep_korada@srmap.edu.in",
    roll_number: "AP21110011383",
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    ...fileInfo
  };

  console.log('Sending response:', response);
  res.json(response);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ is_success: false, message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
