const   Item = require('../models/Item'),
        List = require('../models/List');


// ==================================================
// Lists Route
// ==================================================

// GET route - receive all lists and their items
exports.getListsAndItems = (req, res, next) => {

    List.find({owner: req._user._id}, (err, lists) => {
        var allItems = [];

        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }

        lists.forEach((list, index) => {
            Item.find({ listID: list.listID}, (err, listItems) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                    let err = {
                        message: err.message
                    };
                    return next(err);
                }

                allItems = allItems.concat(listItems);

                // If we've iterated through every list, send our response
                if(index === lists.length - 1) {
                    res.status(200).json({
                        lists: lists,
                        items: allItems
                    });
                }

            }); // end Item.find query

        }); // end lists.forEach iteration

    }); // End List.find query

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

            res.status(200).json({
                successMessage: "List deleted"
            });

        });

    });

    return next();
};
