const express = require("express");
const {
    getAllCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    createCourse
} = require("../controllers/course.controller");
const createCourseValidator = require("../middlewares/courseValidation");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRole");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/")
        .get(getAllCourses)
        .post(createCourseValidator(), createCourse)

router.route("/:id")
        .get(getCourse)
        .patch(updateCourse)
        .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), deleteCourse)


module.exports = router;