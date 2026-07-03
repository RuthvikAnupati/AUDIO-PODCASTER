const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Category = require("../models/category");
const User = require("../models/user");
const Podcast = require("../models/podcasts");
const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//add-podcast
router.post("/add-podcast", authMiddleware, upload , async (req,res) => {
    try {
        const {title , description , category} = req.body;
        
        if (!req.files || !req.files["frontImage"] || !req.files["audioFile"]) {
            return res.status(400).json({ message : "Both Image and Audio files are required"});
        }

        const frontImagePath = req.files["frontImage"][0].path;
        const audioFilePath = req.files["audioFile"][0].path;
        
        if(!title || !description || !category) {
            if (fs.existsSync(frontImagePath)) fs.unlinkSync(frontImagePath);
            if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);
            return res.status(400).json({ message : "All fields are Required "});
        }    
    
        const {user}=req;
        const cat = await Category.findOne ({categoryName : category });
        if(!cat){
            if (fs.existsSync(frontImagePath)) fs.unlinkSync(frontImagePath);
            if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);
            return res.status(400).json({ message : "No category found"});
        }

        // Upload to Cloudinary
        const imageResult = await cloudinary.uploader.upload(frontImagePath, {
            folder: "podcaster/images"
        });

        const audioResult = await cloudinary.uploader.upload(audioFilePath, {
            folder: "podcaster/audio",
            resource_type: "video" // Required for audio
        });

        // Clean up temporary local files
        if (fs.existsSync(frontImagePath)) fs.unlinkSync(frontImagePath);
        if (fs.existsSync(audioFilePath)) fs.unlinkSync(audioFilePath);

        const catid = cat._id;
        const userid = user.id;
        const newPodcast = new Podcast({ 
            title , 
            description , 
            category: catid , 
            frontImage: imageResult.secure_url, 
            audioFile: audioResult.secure_url, 
            user: userid,
        });
    
        await newPodcast.save();
        await Category.findByIdAndUpdate(catid , {
            $push:{podcasts: newPodcast._id},
        });
    
        await User.findByIdAndUpdate(userid , {
            $push: { podcasts : newPodcast._id}
        });
        res.status(201).json({message : "Podcast added successfully"})
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({message: "Failed to add Podcast"})
    }
});

// get all podcasts
router.get("/get-podcasts", async(req,res) => {
    try {
        const podcasts = await Podcast.find().populate("category").sort({ createdAt : -1});
        return res.status(200).json({ data: podcasts});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
});

//get user podcasts
router.get("/get-user-podcasts",authMiddleware, async(req,res) => {
    try {
        
        const { user } = req;
        const userid = user._id;
        const data = await User.findById(userid).populate({
            path : "podcasts", 
            populate:{path: "category" },
        }).select("-password");
        if(data && data.podcasts){
            data.podcasts.sort((a,b) => new Date(b.createdAt)- new Date(a.createdAt)
            );
        }
        return res.status(200).json({ data: data.podcasts});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
});

//Get podcast by id
router.get("/get-podcast/:id", async(req,res) => {
    try {
        const { id }= req.params;
        const podcasts = await Podcast.findById(id).populate("category");
        return res.status(200).json({ data: podcasts});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
});

//Get podcasts by categories
router.get("/category/:cat", async(req,res) => {
    try {
        const { cat }= req.params;
        const categories = await Category.find({categoryName:cat}).populate({path:"podcasts",populate:{path:"category"}});
        let podcasts = [];
        categories.forEach((category) => {
            podcasts = [...podcasts, ...category.podcasts];
        });
        return res.status(200).json({ data: podcasts});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
});
module.exports = router;
