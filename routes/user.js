const express = require("express");
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/user');
const router = express.Router();
const Restaurant = require('../models/restaurants');

//Users are allowed to list all restaurants in the platform without authentication
// GET /GetRestaurants
router.get("/GetRestaurants", userController.getRestaurants);

//Users are allowed to read a specific restaurant in full detail without authentication
// GET GetRestaurant/restaurantId
router.get("/GetRestaurant/:restaurantId", userController.getRestaurant);

router.post("/SearchRestaurant",userController.searchRestaurant);


//Logged-in Users are allowed to create a new restaurant
// POST /AddRestaurant
router.post("/AddRestaurant",
    [
        body('name').isString().isLength({ max: 10 }).trim().withMessage('Please enter a valid restaurant name')
            .custom((value, { req }) => {
                return Restaurant.findOne({ name: value })
                    .then(restauarnt => {
                        if (restauarnt) {
                            return Promise.reject('Restaurant name exists already, please choose a different one');
                        }
                    });
            }),
            body('age','Incorrect age').isNumeric(),
            body('number').isNumeric(),
            body('location').isString().isLength({min:5 , max: 10}).trim()
] ,isAuth,userController.addRestaurant);

//Logged-in Users are allowed to edit their own restaurants only
// POST /UpdateRestaurant/restaurantId
router.post("/UpdateRestaurant/:restaurantId",[
    body('name').isString().isLength({ max: 10}).trim(),
    body('age').isNumeric(),
    body('number').isNumeric(),
    body('location').isString().isLength({min:5 , max: 10}).trim()
], isAuth, userController.updateRestaurant);

//Logged-in Users are allowed to delete their own restaurants only
// GET /DeleteRestaurant/restaurantId
router.get("/DeleteRestaurant/:restaurantId",isAuth,userController.deleteRestaurant);

module.exports = router;