const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2; // Make sure to install the 'cloudinary' package

// Set up Cloudinary configuration with your credentials
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

// Set up multer storage for image file
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/"); // Define the image upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Generate a unique file name with the original file extension
  },
});

// Set up multer storage for certificate file
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates/"); // Define the certificate upload directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Generate a unique file name with the original file extension
  },
});

// Create multer middleware instances for image and certificate uploads
const uploadImage = multer({ storage: imageStorage }).single("imagefile");
const uploadCertificate = multer({ storage: certificateStorage }).single("pcccertificate");

const Employee = require("./EmployeeModel"); // Assuming the Employee model is in the same directory

// Controller function to handle user registration
const registerEmployee = async (req, res) => {
  try {
    // Handle image file upload
    uploadImage(req, res, (imageUploadError) => {
      if (imageUploadError) {
        return res.status(400).json({ error: "Image upload error" });
      }

      // Handle certificate file upload
      uploadCertificate(req, res, async (certificateUploadError) => {
        if (certificateUploadError) {
          return res.status(400).json({ error: "Certificate upload error" });
        }

        // Upload image and certificate files to Cloudinary
        const imageUploadResult = await cloudinary.uploader.upload(req.file.path);
        const certificateUploadResult = await cloudinary.uploader.upload(req.file.path);

        // Create a new Employee instance with Cloudinary URLs
        const {
          name,
          phonenumber,
          email,
          password,
          Aadharnumber,
          gender,
          address,
          pincode,
          state,
          skills,
        } = req.body;

        const imagefile = imageUploadResult.secure_url;
        const pcccertificate = certificateUploadResult.secure_url;

        const employee = new Employee({
          name,
          phonenumber,
          email,
          password,
          Aadharnumber,
          gender,
          address,
          pincode,
          state,
          imagefile,
          pcccertificate,
          skills,
        });

        // Save the Employee data to the database
        await employee.save();

        // Remove the local files from the folder
        fs.unlinkSync(req.file.path);

        return res.status(201).json({ message: "Employee registered successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerEmployee };
