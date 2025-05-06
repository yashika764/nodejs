const Category = require("../models/categoryModel");
const Role = require("../models/roleModel");

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

            const categoryExist = await Category.findOne({ name })
            if (categoryExist) {
                return res.status(400).json({ success: false, message: "category already exist" })
            }
    
            const newCategory=new Category({
                name,
                createdBy:req.user.id
            })
            await newCategory.save();
            res.status(201).json({ success: true, message: "book category create" })

    } catch (error) {
        res.status(500).json({ success: false, message: "server error" })
    }
}



module.exports = { createCategory }