const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const { encryptData } = require("../utils/encrypt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Place = require("../models/placeModel");
const cloudinary = require("cloudinary")



exports.createRole = catchAsyncErrors(async (req, res, next) => {
    const { name } = req.body
    await Role.create({ name })
    return res.status(200).json({ success: true, message: "role created" })
})

exports.getAllRoles = catchAsyncErrors(async (req, res, next) => {
    const role = await Role.find();
    res.status(200).json({ success: true, role })
})

exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    const newEmail = email.toLowerCase()
    const userExist = await User.findOne({ email: newEmail })

    if (userExist) {
        return next(new ErrorHandler("user already exist", 400))
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email: newEmail,
        phone,
        password: hashPassword,
        role: req.body.role
    })

    await newUser.save()
    res.status(201).json({ success: true, message: "user created successfully" })


})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("email or Password required", 400))
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid user", 400))
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return next(new ErrorHandler("Password not match", 400))
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20d' })
    const encryptToken = encryptData(token)

    res.cookie('token', encryptToken, {
        httpOnly: true
    })

    res.status(200).json({ success: true, message: "Login successfully" })
})

exports.createPlace = catchAsyncErrors(async (req, res, next) => {
    const { placeName, location, pricePerNight } = req.body;
    const placeImage = req.files?.placeImage; 

    if (!placeImage) {
        return next(new ErrorHandler("Please upload an image", 400));
    }
    if (!placeName || !location || !pricePerNight) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    try {
        const myCloud = await cloudinary.v2.uploader.upload(placeImage.tempFilePath, {
            folder: "airbnb",
            width: 150,
            crop: "scale",
        });
        console.log(myCloud)


        const placeExist = await Place.findOne({ placeName });
        if (placeExist) {
            return next(new ErrorHandler("Place already exists", 400));
        }

        const newPlace = new Place({
            placeName,
            location,
            pricePerNight,
            placeImage: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

        await newPlace.save();
        res.status(200).json({ success: true, message: "Place created successfully" });
    } catch (error) {
        return next(new ErrorHandler("Error uploading image", 500));
    }
});

