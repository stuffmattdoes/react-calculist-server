const   Item = require('../models/Item'),
        List = require('../models/List');


// ==================================================
// Lists Route
// ==================================================

// GET route - receive all existing lists
exports.getLists = (req, res, next) => {

    List.find({owner: req._user.email}, (err, lists) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        } else {
            res.status(200).json({
                lists: lists
            });
        }
    });
};

// POST route - create lists
/*
{
    "listID": "iv3v3mtv",
    "title": "List Title"
}
*/
exports.createList = (req, res, next) => {
    var list = req.body;
    List.create(list, (err, list) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        } else {
            res.status(200).json({
                list: list,
                message: "List created."
            });
            return next();
        }
    });
};

// PUT route - update existing lists
/*
{
    "listID": "iv3v3mtv",
    "updates": {
        "title": "Updated List Title",
    }
}
*/
exports.updateList = (req, res, next) => {
    var id = req.params.listID;
    var listUpdates = req.body.updates;
    
    // Query our list for our ID, then update it
    List.update({listID: id}, listUpdates, {new: true}, (err, list) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        } else {
            res.status(200).json({
                list: list,
                successMessage: "List updated"
            });
            return next();
        }
    });

};

// DELETE route - delete existing lists
exports.deleteList = (req, res, next) => {
    var id = req.params.listID;

    // Delete the list
    List.remove({listID: id}, (err, list) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
    });

    // Delete the list's items
    Item.remove({listID: id}, (err, item) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
    });

    res.status(200).json({
        successMessage: "List deleted"
    });
    return next();
};
