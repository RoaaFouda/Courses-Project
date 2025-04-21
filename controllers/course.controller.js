const { validationResult } = require("express-validator");
const Course = require("../models/Course.model");
const AppError = require("../utils/AppError");
const success = require("../utils/success");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllCourses = asyncWrapper(async (req, res, next) => {
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;


    const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
    res.json(success(courses));
        
})

const getCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById(id);
    if(!course){
        const error = AppError.create("course not found", 404);
        return next(error);
    }
    res.json(success(course)); 
})

const createCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = AppError.create(errors.array(), 400)
        return next(error);
    }

    const {title, price} = req.body;
    const course = await Course.create({
        title, 
        price
    });
    res.json(success(course));
})


const updateCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const {title, price} = req.body;
    const course = await Course.findOneAndUpdate({_id: id}, {title, price}, {new: true});
    if(!course){
        const error = AppError.create("course not found", 404);
        return next(error);
    }
    res.json(success(course));
        
})

const deleteCourse = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const course = await Course.findOneAndDelete({_id: id});
    if(!course){
        const error = AppError.create("course not found", 404);
        return next(error);
    }
    res.json(success(course));
        
})

module.exports = {
    getAllCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    createCourse
}