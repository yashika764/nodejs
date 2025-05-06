const Library = require("../models/libraryModel");
const Role = require("../models/roleModel");


const createLibrary = async (req, res) => {

    try {
        const { bookname, categoryId } = req.body;

        const bookExist = await Library.findOne({ bookname });
        if (bookExist) {
            return res.status(400).json({ success: false, message: "book already exist" })
        }
        const newBook = new Library({
            bookname,
            category: categoryId,
            createdBy: req.user.id
        })

        await newBook.save();
        res.status(201).json({ success: true, message: "book created" })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }

}

const updateBook = async (req, res) => {
    try {
        const { bookname, categoryId } = req.body;


        const updatebook = await Library.findByIdAndUpdate(req.params.id, { bookname, categoryId })
        if (!updatebook) {
            res.status(400).json({ success: false, message: "book not found" })
        }

        res.status(200).json({ success: true, message: "Book Updated successfully" })

    } catch (error) {
        res.status(400).json({ success: false, message: "only admin can update book" })
    }
}

const getAllBook = async (req, res) => {
    try {
        const query = { isdeleted: false }
        let { sortBy, page, limit, search, book } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2;
        sortBy = sortBy || 'createdAt';
        book = book === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        // if (search) {
        //     query.bookname = { $regex: search, $options: 'i' };
        // }


        // search filter

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { bookname: regex }
            ];
        }

        const totalBook = await Library.countDocuments(query)

        const books = await Library.find(query).select(" -__v -updatedAt -isdeleted")
            // .populate({ path: 'category', select: 'name' })
            .populate("category createdBy", "name")
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json({ success: true, totalBook, books })
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

const deleteBook = async (req, res) => {
    try {
        await Library.updateOne(
            {
                _id: req.params.id
            },
            {
                isdeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            })
        res.status(200).json({ success: true, message: "book deleted Successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}

module.exports = { createLibrary, getAllBook, updateBook, deleteBook }