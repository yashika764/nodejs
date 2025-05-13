const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const { encryptData } = require("../utils/encrypt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Place = require("../models/placeModel");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../utils/apifeatures");
const Booking = require("../models/bookingModel");
const Category = require("../models/categoryModel");



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
    const profileImage = req.files?.profileImage

    if (!profileImage) {
        return next(new ErrorHandler("Please upload an image", 400));
    }

    if (!name || !email || !phone || !password || !role) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    const myCloud = await cloudinary.v2.uploader.upload(profileImage.tempFilePath, {
        folder: "profileImage",
        width: 150,
        crop: "scale",
    });
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
        profileImage: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
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

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const { category } = req.body;
    const categoryExist = await Category.findOne({ category });
    if (categoryExist) {
        return next(new ErrorHandler("category already existed", 400))
    }
    const newCategory = new Category({
        category,
        createdBy: req.user._id
    })
    newCategory.save()
    res.status(200).json({ success: true, message: "category created" })

})

exports.createPlace = catchAsyncErrors(async (req, res, next) => {
    const { placeName, country, pricePerNight, city, state, maxGuest, bedRooms, beds, amenities , categoryId } = req.body;
    const placeImage = req.files?.placeImage;

    if (!placeImage) {
        return next(new ErrorHandler("Please upload an image", 400));
    }
    if (!placeName || !country || !pricePerNight) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    const myCloud = await cloudinary.v2.uploader.upload(placeImage.tempFilePath, {
        folder: "airbnb",
        width: 150,
        crop: "scale",
    });
    // console.log(myCloud)

    const placeExist = await Place.findOne({ placeName });
    if (placeExist) {
        return next(new ErrorHandler("Place already exists", 400));
    }

    const newPlace = new Place({
        placeName,
        city, state,
        country,
        maxGuest,
        pricePerNight,
        bedRooms, beds,
        amenities,
        placeImage: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        category:categoryId,
        createdBy: req.user._id
    });

    await newPlace.save();
    res.status(200).json({ success: true, message: "Place created successfully" });
});

exports.updatePlace = catchAsyncErrors(async (req, res, next) => {
    const { placeName, country, pricePerNight, city, state, maxGuest, bedRooms, beds, amenities } = req.body;
    const placeImage = req.files?.placeImage;

    const place = await Place.findById(req.params.id)
    if (!place) {
        return next(new ErrorHandler("place not found", 400))
    }
    const imageId = place.placeImage.public_id;
    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud = await cloudinary.v2.uploader.upload(placeImage.tempFilePath, {
        folder: "airbnb",
        width: 150,
        crop: "scale",
    });
    // console.log(myCloud)

    if (myCloud) {
        place.placeImage = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    place.placeName = placeName;
    place.city = city;
    place.state = state;
    place.country = country;
    place.maxGuest = maxGuest;
    place.bedRooms = bedRooms;
    place.beds = beds;
    place.amenities = amenities;
    place.pricePerNight = pricePerNight;

    await place.save();

    res.status(200).json({ success: true, message: "place updated" })

})

exports.getAllPlace = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 2;
    const totalPlace = await Place.countDocuments();

    const ApiFeature = new ApiFeatures(Place.find().select("-__v -updatedAt").populate("createdBy", "email"), req.query)
        .search()
        .filter()

    let places = await ApiFeature.query

    ApiFeature.pagination(resultPerPage);


    res.status(200).json({
        success: true,
        totalPlace,
        resultPerPage,
        places
    })

})

exports.deletePlace = catchAsyncErrors(async (req, res, next) => {
    const place = await Place.findById(req.params.id);

    if (!place) {
        return next(new ErrorHandler("place not found", 400))
    }

    const imageId = place.placeImage.public_id;
    await cloudinary.v2.uploader.destroy(imageId)

    await place.deleteOne()

    res.status(200).json({ success: true, message: "place delete successfully" })
})

exports.createBooking = catchAsyncErrors(async (req, res, next) => {
    const { guest, checkIn, checkOut, placeId, totalNight ,totalGuests  } = req.body;

    if (!guest || !checkIn || !checkOut) {
        return next(new ErrorHandler("All fields are required", 400))
    }
    const place = await Place.findById(placeId)
    if (!place) {
        return next(new ErrorHandler("Place not found", 400))
    }

    totalPriceCount = place.pricePerNight * totalNight

    const newBooking = new Booking({
        guest,
        checkIn,
        checkOut,
        place: placeId,
        totalGuests,
        totalNight,
        totalPrice: totalPriceCount,
        createdBy: req.user._id

    })

    await newBooking.save()

    res.status(201).json({ success: true, message: "booking created" })

})

exports.updateBooking = catchAsyncErrors(async (req, res, next) => {
    const { guest, checkIn, checkOut, totalNight } = req.body;
    const { bookingId } = req.params
    const booking = await Booking.findById(bookingId).populate("place")
    console.log(bookingId);

    const place = booking.place
    console.log(place);

    if (!booking) {
        return next(new ErrorHandler("booking not found", 400))
    }

    booking.guest = guest;
    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    booking.totalNight = totalNight
    booking.totalPrice = place.pricePerNight * totalNight

    await booking.save()
    res.status(200).json({ success: true, message: "booking updated" })
})