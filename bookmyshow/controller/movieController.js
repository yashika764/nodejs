const Role = require("../models/roleModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/encrypt");
const Movie = require("../models/movieModel");
const sendMail = require("../utils/mail");
const Theater = require("../models/theaterModel");
const Show = require("../models/showModel");
const Booking = require("../models/bookingModel");
const path = require("path");
const fs = require("fs");
const Screen = require("../models/screenModel");
const Seats = require("../models/seatsModel");



const createMovie = async (req, res) => {
    try {
        const { movieName, language } = req.body;
        if (!movieName || !language) {
            return res.status(400).json({ success: false, message: "Both fields are required" })

        }

        const movieExist = await Movie.findOne({ movieName })
        if (movieExist) {
            return res.status(400).json({ success: false, message: "movie already exist" })
        }

        const movieImage = req.file ? req.file.path : '';
        const newMovie = new Movie({
            movieName,
            language,
            movieImage,
            createdBy: req.user.id
        })
        // console.log(newMovie);

        await newMovie.save();
        res.status(201).json({ success: true, message: "movie created successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllMovie = async (req, res) => {
    try {
        let { page, limit, sortBy, movies, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        sortBy = sortBy || 'createdAt';
        movies = movies === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        const query = { isDeleted: false };

        // Search Filter 
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { movieName: regex },
                { theatreName: regex },
            ];
        }
        const movie = await Movie.find(query).select(" -__v  -updatedAt -isDeleted")
            .populate("createdBy", "name email")
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
        const total = await Movie.countDocuments(query);

        if (!movie) {
            return res.status(400).json({ success: false, message: "movie not found" })
        }
        res.status(200).json({
            success: true,
            totalMovies: total,
            movie
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, error })
    }
}

const movieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).select(" -__v -createdAt -updatedAt -isDeleted")
        res.status(200).json({ success: true, movie })
    } catch (error) {
        res.status(500).json({ success: false, message: "error" })
    }
}

const updateMovie = async (req, res) => {
    try {
        // const movieId = req.params;
        const { movieName, language } = req.body || {};

        const updateMovie = await Movie.findById(req.params.id)
        if (!updateMovie) {
            return res.status(400).json({ success: false, message: "movie not found" })
        }

        if (movieName) {
            updateMovie.movieName = movieName
        }

        if (language) {
            updateMovie.language = language;
        }

        if (req.file) {
            if (updateMovie.movieImage) {
                const oldPath = path.join(__dirname, '..', 'uploads', updateMovie.movieImage)
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateMovie.movieImage = req.file.path;
        }
        await updateMovie.save()
        res.status(200).json({ success: true, message: "movie updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const deleteMovie = async (req, res) => {
    try {
        await Movie.updateOne(
            {
                _id: req.params.id
            },
            {
                isDeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            }
        )
        res.status(200).json({ success: true, message: "movie delete successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const bookTicket = async (req, res) => {
    try {
        const { seatsBooked, movieId, userId, } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            res.status(400).json({ success: false, message: "movie not found" })
        }

        if (movie.seatsAvailable < seatsBooked) {
            res.status(400).json({ success: false, message: "not enough seats available" })
        }

        const user = await User.findById(userId);
        // console.log(user);
        const userEmail = user.email

        if (!user) {
            res.status(400).json({ success: false, message: "user not found" })

        }
        console.log(userEmail);
        const booking = {
            seatsBooked
        }
        movie.seatsAvailable -= seatsBooked
        movie.bookings.push(booking)
        movie.save()
        await sendMail(userEmail, `ticket booked for ${movie.movieName} successfully`)

        res.status(201).json({ success: true, message: "ticket booked successfully" })
    } catch (error) {
        res.status()
    }
}

const updateTicket = async (req, res) => {
    try {
        const { movieId, userId, bookingId, newBooking } = req.body
        const movie = await Movie.findById(movieId)
        if (!movie) {
            res.status(400).json({ success: false, message: "movie not found" })
        }

        const user = await User.findById(userId)
        if (!user) {
            res.status(400).json({ success: false, message: "user not found" })
        }
        const bookingIndex = movie.bookings.findIndex(b => b._id.toString() === bookingId)
        console.log("bookingId", bookingId);

        const booking = movie.bookings[bookingIndex]
        console.log(booking);

        if (!booking) {
            res.status(400).json({ success: false, message: "booking not found" })

        }
        movie.seatsAvailable += movie.seatsBooked
        if (movie.seatsAvailable < newBooking) {
            res.status(400).json({ success: false, message: "not enough seats available" })
        }

        movie.seatsBooked = newBooking
        console.log("new booking seat ==", newBooking);

        movie.seatsAvailable -= newBooking
        console.log(movie.seatsAvailable);

        // console.log(movie);
        movie.save()
        res.status(200).json({ success: true, message: "updated booking" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: "All fileds are required" })
        }

        const newEmail = email.toLowerCase()
        const userExist = await User.findOne({ email: newEmail })

        if (userExist) {
            return res.status(400).json({ success: false, message: "User already Exist" })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: newEmail,
            phone,
            password: hashPassword,
            role: req.body.role
        })

        await newUser.save();
        res.status(201).json({ success: true, message: "user created successfully" })


    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })

    }




}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email or password required" })
        }

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "password not match" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '20d' })
        const encryptToken = encryptData(token)

        res.cookie('token', encryptToken, {
            httpOnly: true
        })

        res.status(200).json({ success: true, message: "Login successfully" })
    } catch (error) {
        // console.log(error);

        return res.status(500).json({ success: false, message: "server error" })
    }
}

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        await Role.create({ name });
        res.status(200).json({ success: true, message: "role added" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllRoles = async (req, res) => {
    try {
        const role = await Role.find();
        res.status(200).json({ success: true, role })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server err" })
    }
}

const createTheater = async (req, res) => {
    try {
        const { theatreName, totalSeats, location } = req.body;
        const theaterExist = await Theater.findOne({ theatreName })
        if (theaterExist) {
            res.status(400).json({ success: false, message: "theater already exist" })
        }

        const newTheater = new Theater({
            theatreName,
            location,
            totalSeats
        })

        await newTheater.save()

        return res.status(201).json({ success: true, message: "theater created successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllTheater = async (req, res) => {
    try {
        let { page, limit, sortBy, theaters, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        sortBy = sortBy || 'createdAt';
        theaters = theaters === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        const query = { isDeleted: false };

        // Search Filter 
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { location: regex },
                { theatreName: regex },
            ];
        }
        const theater = await Theater.find().select("-__v -isDeleted -updatedAt")
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)

        const total = await Theater.countDocuments(query)
        res.status(200).json({ success: true, totalTheater: total, theater })
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: "server error" })
    }
}

const updateTheater = async (req, res) => {
    try {
        const { theatreName, location, totalSeats } = req.body;
        const updateTheater = await Theater.findByIdAndUpdate(req.params.id, { theatreName, location, totalSeats })
        if (!updateTheater) {
            res.status(400).json({ success: false, message: "theater not found" })
        }
        res.status(200).json({ success: true, message: "movie updated successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const deleteTheater = async (req, res) => {
    try {
        await Theater.updateOne(
            {
                _id: req.params.id
            },
            {
                isDeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            }
        )
        res.status(200).json({ success: true, message: "theater delete successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const createShow = async (req, res) => {
    try {
        const { showTime, price, movieId, theaterId, seatId, screenId } = req.body;
        // const {screenId}=req.params
        if (!showTime || !price) {
            return res.status(400).json({ success: false, message: "all fields are required" })
        }

        // const seats = seatGenerate()

        const movie = await Movie.findById(movieId)
        if (!movie) {
            return res.status(400).json({ success: false, message: "movie not found" })
        }

        const theater = await Theater.findById(theaterId)
        if (!theater) {
            return res.status(400).json({ success: false, message: "theater not found" })

        }
        // const seat = await Seats.findById(seatId)
        // if (!seat) {
        //     return res.status(400).json({ success: false, message: "seat not found" })
        // }

        const screen = await Screen.findById(screenId);
        // if (!screen) {
        //     return res.status(400).json({ success: false, message: "screen not found" })

        // }

        const newShow = new Show({
            showTime,
            price,
            movie: movieId,
            theater: theaterId,
            screen: screenId
        })
        // console.log(newShow);

        await newShow.save();
        return res.status(201).json({ success: true, message: "show created successfully" })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: "server error" })

    }
}

const updateShow = async (req, res) => {

    try {
        const { showTime, price } = req.body;
        const show = await Show.findByIdAndUpdate(req.params.id, { showTime, price, })
        if (!show) {
            return res.status(400).json({ success: false, message: "show not found" })
        }
        return res.status(200).json({ success: true, message: "show updated successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const deleteShow = async (req, res) => {
    try {
        await Show.updateOne(
            {
                _id: req.params.id
            },
            {
                isDeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            }
        )
        res.status(200).json({ success: true, message: "theater delete successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllShow = async (req, res) => {
    try {
        let { page, limit, sortBy, shows, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        sortBy = sortBy || 'createdAt';
        shows = shows === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        const query = { isDeleted: false };

        // Search Filter 
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { showTime: regex },
            ];
        }
        const show = await Show.find().select("-__v -seats -updatedAt -isDeleted")
            .populate("movie theater", "theatreName movieName")
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
        if (!show) {
            res.status(400).json({ success: false, message: "show not found" })
        }
        const total = await Show.countDocuments(query)
        res.status(200).json({ success: true, totalShows: total, show })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ success: false, message: "server error" })
    }
}

const createBooking = async (req, res) => {
    // console.log(req.body);

    try {
        const { showId, userId, selectSeats } = req.body;

        const show = await Show.findById(showId)
        if (!show) {
            res.status(400).json({ success: false, message: "show not found" })
        }
        // console.log(showId);

        const user = await User.findById(userId)
        if (!user) {
            res.status(400).json({ success: false, message: "user not found" })

        }
        // console.log(userId);
        const userEmail = user.email
        console.log(userEmail);


        const oldBookedSeats = selectSeats.filter(seatNumber =>
            show.seats.find(s => s.seatNumber === seatNumber && s.isBooked)
        )

        if (oldBookedSeats.length > 0) {
            return res.status(400).json({ success: false, message: `seats already book ${oldBookedSeats}` })
        }

        // console.log(oldBookedSeat);

        const newBooking = new Booking({
            seatsBooked: selectSeats,
            numberOfSeats: selectSeats.length,
            totalPrice: show.price * selectSeats.length,
            show: showId,
            user: userId
        })

        // console.log(newBooking);
        await newBooking.save();

        selectSeats.forEach(seatNumber => {
            const seat = show.seats.find(s => s.seatNumber === seatNumber)
            if (seat) {
                seat.isBooked = true
            }
        })
        await show.save();
        await sendMail(userEmail, `your seat has been confirmed ${selectSeats} `)
        res.status(201).json({ success: true, message: "your email sent to confirmation" })

    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: "server error" })
    }

}

const updateBooking = async (req, res) => {
    try {

        const { bookingId } = req.params
        console.log(bookingId);

        const { selectSeats } = req.body;

        const booking = await Booking.findById(bookingId).populate("show")
        if (!booking) {
            return res.status(400).json({ success: false, message: "booking not found" })
        }
        const show = booking.show

        const oldBookedSeats = selectSeats.filter(seatNumber =>
            show.seats.find(s => s.seatNumber === seatNumber && s.isBooked)
        )

        if (oldBookedSeats.length > 0) {
            return res.status(400).json({ success: false, message: `seat ${oldBookedSeats} already booked` })
        }

        booking.seatsBooked.forEach(seatNumber => {
            const seat = show.seats.find(s => s.seatNumber === seatNumber)
            if (seat) {
                seat.isBooked = false;
            }
        })

        selectSeats.forEach(seatNumber => {
            const seat = show.seats.find(s => s.seatNumber === seatNumber)
            if (seat) {
                seat.isBooked = true;
            }
        })

        booking.seatsBooked = selectSeats,
            booking.numberOfSeats = selectSeats.length,
            booking.totalPrice = show.price * selectSeats.length

        await booking.save()
        await show.save();

        res.status(200).json({ success: true, message: "seats updated successfully" })


    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: "server error" })
    }
}

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params

        const booking = await Booking.findById(bookingId).populate("show")
        if (!booking) {
            return res.status(400).json({ success: false, message: "booking not found" });

        }
        const show = booking.show

        booking.seatsBooked.forEach(seatNumber => {
            const seat = show.seats.find(s => s.seatNumber === seatNumber)
            if (seat) {
                seat.isBooked = false;
            }
        })

        await show.save();
        await Booking.findByIdAndDelete(bookingId)

        res.status(200).json({ success: true, message: "delete successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error " })
    }
}

const getAllBooking = async (req, res) => {
    try {
        let { page, limit, sortBy, bookings, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        sortBy = sortBy || 'createdAt';
        bookings = bookings === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        const query = {};

        // Search Filter 
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { showTime: regex },
                { seatsBooked: regex }
            ];
        }
        const booking = await Booking.find().select("-__v").populate("user show", "email showTime")
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)

        if (!booking) {
            return res.status(400).json({ success: false, message: "booking not found" })
        }
        const total = await Booking.countDocuments()
        res.status(200).json({ success: true, totalBooking: total, booking })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const ScreenCreate = async (req, res) => {
    try {
        const { theaterId, screen } = req.body;
        const theater = await Theater.findById(theaterId)
        if (!theater) {
            return res.status(400).json({ success: false, message: "theater not found" })
        }

        const newscreen = new Screen({
            screen,
            theater: theaterId
        })

        await newscreen.save();
        return res.status(200).json({ success: true, message: "screen created successfully" })

    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: "server error" })
    }
}

const screenUpdate = async (req, res) => {
    try {
        const { screen } = req.body
        const updateScreen = await Screen.findByIdAndUpdate(req.params.id, { screen })
        if (!updateScreen) {
            return res.status(400).json({ success: false, message: "screen not found" })
        }

        await updateScreen.save();
        return res.status(200).json({ success: true, message: "screen Updated successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })

    }
}

function seatGenerate() {
    let seats = [];
    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 20;

    rows.forEach(rows => {
        for (let i = 0; i < seatsPerRow; i++) {
            seats.push({ seatNumber: `${rows}${i}`, isBooked: false })
        }
    })

    return seats;
}

const createSeat = async (req, res) => {
    try {
        const { totalRows, seatsPerRow } = req.body

        await Screen.findById(req.params.id)
        // console.log(screen);

        // if (!screen) {
        //     return res.status(400).json({ success: false, message: "screen not found" })
        // }

        const seatsInsert = [];
        const rowLetter = (index) => {
            return String.fromCharCode(65 + index);
        };
        for (let i = 0; i < totalRows; i++) {
            const row = rowLetter(i);
            for (let j = 0; j < seatsPerRow; j++) {
                // seatsInsert.push({ seatNumber: `${row}${j + 1}`, isBooked: false });
                seatsInsert.push({
                    seatNumber: `${row}${j + 1}`,
                    isBooked: false,
                })
            }
        }
        const newSeat = new Seats({
            seat: seatsInsert,
            screen: req.params.id

        })

        await newSeat.save()

        res.status(200).json({ success: true, message: "seat create successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "server error" })
    }
}

module.exports = { createUser, createRole, getAllRoles, loginUser, createMovie, getAllMovie, movieById, updateMovie, deleteMovie, bookTicket, updateTicket, createTheater, getAllTheater, updateTheater, deleteTheater, createShow, getAllShow, updateShow, deleteShow, createBooking, updateBooking, cancelBooking, getAllBooking, ScreenCreate, screenUpdate, createSeat }