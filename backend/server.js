require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

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

// --- Models ---
const UserSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true, match: /^\d{10}$/ },
    password: { type: String, required: true },
    isResident: { type: Boolean, default: false }
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);

const QuizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
});
const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionSchema);

const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        likes: { type: Number, default: 0 },
        image: { type: String, default: "" },
        contact: { type: String, default: "" },
        status: { type: String, enum: ["pending", "verified"], default: "pending" }
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

const GalleryImageSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        imageUrl: { type: String, required: true },
        status: { type: String, enum: ["pending", "verified"], default: "pending" }
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
        status: { type: String, enum: ["pending", "verified"], default: "pending" }
    },
    { timestamps: true }
);

const PageContribution = mongoose.model("PageContribution", PageContributionSchema);

// --- Middleware ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// --- Routes ---
app.post("/api/auth/register", async (req, res) => {
    try {
        const { mobile, password, isResident } = req.body;
        if (!mobile || mobile.length !== 10) return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
        if (!password) return res.status(400).json({ error: "Password is required" });

        const existingUser = await User.findOne({ mobile });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ mobile, password: hashedPassword, isResident: Boolean(isResident) });
        await user.save();

        const token = jwt.sign({ userId: user._id, isResident: user.isResident }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { mobile: user.mobile, isResident: user.isResident } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User.findOne({ mobile });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, isResident: user.isResident }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { mobile: user.mobile, isResident: user.isResident } });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.get("/api/quiz/questions", async (req, res) => {
    try {
        const questions = await QuizQuestion.aggregate([{ $sample: { size: 10 } }]);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running securely!");
});

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find({ status: "verified" }).sort({ likes: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

app.get("/api/blogs/top", async (req, res) => {
    try {
        const blogs = await Blog.find({ status: "verified" }).sort({ likes: -1 }).limit(3);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top blogs" });
    }
});

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, status: "verified" });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

app.post("/api/blogs", authMiddleware, upload.single("image"), async (req, res) => {
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
            status: "pending"
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
        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, status: "verified" },
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
app.get("/api/contributions", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { status: "verified" };
        if (category) filter.category = category;
        const contributions = await PageContribution.find(filter).sort({ createdAt: -1 });
        res.json(contributions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch contributions" });
    }
});

app.post("/api/contributions", authMiddleware, contributionUpload.single("image"), async (req, res) => {
    try {
        if (!req.user.isResident) {
            return res.status(403).json({ error: "Only verified residents can contribute to pages." });
        }
        
        const { title, text, category, location } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        if (!category) return res.status(400).json({ error: "Category is required" });
        if (!req.file) return res.status(400).json({ error: "Image is required" });
        
        const result = await uploadToCloudinary(req.file.buffer, "malitibba-contributions", 1400, 1000);
        const imageUrl = result.secure_url;
        
        const contribution = new PageContribution({ title, text: text || "", imageUrl, category, location: location || "", status: "pending" });
        await contribution.save();
        res.status(201).json(contribution);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save contribution" });
    }
});

/* ─── Gallery Routes ─────────────────────────────────── */
app.get("/api/gallery", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 6));
        const skip = (page - 1) * limit;
        const [images, total] = await Promise.all([
            GalleryImage.find({ status: "verified" }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            GalleryImage.countDocuments({ status: "verified" }),
        ]);
        res.json({ images, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch gallery images" });
    }
});

app.post("/api/gallery", authMiddleware, galleryUpload.single("image"), async (req, res) => {
    try {
        if (!req.user.isResident) {
            return res.status(403).json({ error: "Only verified residents can contribute to the gallery." });
        }

        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        if (!req.file) return res.status(400).json({ error: "Image is required" });
        
        const result = await uploadToCloudinary(req.file.buffer, "malitibba-gallery", 1600, 1200);
        const imageUrl = result.secure_url;
        
        const image = new GalleryImage({ title, imageUrl, status: "pending" });
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