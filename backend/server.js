require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json());


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const galleryUpload = multer({ storage: memoryStorage });
const contributionUpload = multer({ storage: memoryStorage });

const uploadToCloudinary = async (buffer, folder, width, height) => {
    const webpBuffer = await sharp(buffer)
        .resize(width, height, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, format: "webp" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(webpBuffer);
    });
};


const connectdb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/malitiba";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectdb();


const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        likes: { type: Number, default: 0 },
        image: { type: String, default: "" },
        contact: { type: String, default: "" },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

const GalleryImageSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", GalleryImageSchema);

const PageContributionSchema = new mongoose.Schema(
    {
        title:    { type: String, required: true, trim: true },
        text:     { type: String, default: "" },
        imageUrl: { type: String, required: true },
        category: { type: String, enum: ["temples", "culture", "history"], required: true },
        location: { type: String, default: "" },
    },
    { timestamps: true }
);

const PageContribution = mongoose.model("PageContribution", PageContributionSchema);




app.get("/", (req, res) => {
    res.send("Backend is running securely!");
});


app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ likes: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});


app.get("/api/blogs/top", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ likes: -1 }).limit(3);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top blogs" });
    }
});


app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

app.post("/api/blogs", upload.single("image"), async (req, res) => {
    try {
        const { title, content, author, contact } = req.body;
        let imageUrl = "";

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "malitibba-blogs", 1200, 800);
            imageUrl = result.secure_url;
        }

        const blog = new Blog({
            title,
            content,
            author,
            contact,
            image: imageUrl,
            likes: 0,
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to publish blog" });
    }
});


app.patch("/api/blogs/:id/like", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: "Failed to like blog" });
    }
});


/* ─── Page Contribution Routes ─────────────────────────── */

// GET /api/contributions?category=temples|culture|history
app.get("/api/contributions", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const contributions = await PageContribution.find(filter).sort({ createdAt: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch contributions" });
    }
});

// POST /api/contributions  → upload image to Cloudinary, save to DB
app.post("/api/contributions", contributionUpload.single("image"), async (req, res) => {
    try {
        const { title, text, category, location } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        if (!category) return res.status(400).json({ error: "Category is required" });
        if (!req.file) return res.status(400).json({ error: "Image is required" });
        
        const result = await uploadToCloudinary(req.file.buffer, "malitibba-contributions", 1400, 1000);
        const imageUrl = result.secure_url;
        
        const contribution = new PageContribution({ title, text: text || "", imageUrl, category, location: location || "" });
        await contribution.save();
        res.status(201).json(contribution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save contribution" });
    }
});

/* ─── Gallery Routes ─────────────────────────────────── */

// GET /api/gallery?page=1&limit=6  → paginated, newest first
app.get("/api/gallery", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 6));
        const skip = (page - 1) * limit;
        const [images, total] = await Promise.all([
            GalleryImage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            GalleryImage.countDocuments(),
        ]);
        res.json({ images, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch gallery images" });
    }
});

// POST /api/gallery  → upload image to Cloudinary, save { title, imageUrl }
app.post("/api/gallery", galleryUpload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        if (!req.file) return res.status(400).json({ error: "Image is required" });
        
        const result = await uploadToCloudinary(req.file.buffer, "malitibba-gallery", 1600, 1200);
        const imageUrl = result.secure_url;
        
        const image = new GalleryImage({ title, imageUrl });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload image" });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});