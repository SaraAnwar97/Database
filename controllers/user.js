const Restaurant = require('../models/restaurants');
const User = require('../models/users');
const failedValidation = require('../middleware/failed-validation');

exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ message: 'Fetched restaurants successfuly', restaurants: restaurants });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

exports.getRestaurant = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    try {
        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            const error = new Error('Could not find restaurant');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Fetched a restaurant successfuly', restaurant: restaurant })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

exports.searchRestaurant = async (req, res, next) => {
    failedValidation;
    const name = req.body.name;
    const age = req.body.age;
    const location = req.body.location;
    const number = req.body.number;
    try {
        const restaurant = await Restaurant.find({
            $or: [
                { name: name },
                { age: age },
                { location: location },
                { number: number }],
        })
        if (!restaurant) {
            const error = new Error('Could not find restaurant!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ restaurant: restaurant });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};


exports.addRestaurant = async (req, res, next) => {
   failedValidation;
    const name = req.body.name;
    const age = req.body.age;
    const location = req.body.location;
    const number = req.body.number;
    const restaurant = new Restaurant({
        name: name,
        age: age,
        location: location,
        number: number,
        lastUpdatedOn: Date.now(),
        creator: req.userId
    });
    try {
        await restaurant.save()
        //logged in user
        const user = await User.findById(req.userId);
        user.restaurants.push(restaurant); //push restaurant mongoose object to user model
        await user.save();
        res.status(201).json({
            message: "Restaurant added",
            restaurant: restaurant,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};
exports.updateRestaurant = async (req, res, next) => {
    failedValidation;
    const name = req.body.name;
    const age = req.body.age;
    const location = req.body.location;
    const number = req.body.number;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const error = new Error('Could not find restaurant');
            error.statusCode = 404;
            throw error;
        }
        //if creator id == id of logged user (userId recieved from token)
        if (restaurant.creator.toString() !== req.userId) {
            const error = new Error('Not authorized')
            error.statusCode = 403;
            throw error;
        }
        restaurant.name = name;
        restaurant.age = age;
        restaurant.location = location;
        restaurant.number = number;
        const result = await restaurant.save();
        return res.status(200).json({ message: 'Restaurant updated', restaurant: result });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
}

exports.deleteRestaurant = async (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    try {
        const restaurant = await Restaurant.findById(restaurantId)
        if (!restaurant) {
            const error = new Error('Could not find restaurant');
            error.statusCode = 404;
            throw error;
        }
        //if creator id == id of logged user (userId recieved from token)
        if (restaurant.creator.toString() !== req.userId) {
            const error = new Error('Not authorized')
            error.statusCode = 403;
            throw error;
        }
        await Restaurant.findByIdAndRemove(restaurantId);
        const user = await User.findById(req.userId);
        user.restaurants.pull(restaurantId); //removing restaurant from user collection when deleted
        await user.save();
        res.status(200).json({ message: 'Restaurant deleted' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
}