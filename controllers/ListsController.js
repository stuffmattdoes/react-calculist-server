const   Item = require('../models/Item'),
        List = require('../models/List');


// ==================================================
// Lists Route
// ==================================================

// GET route - receive all lists and their items
exports.getListsAndItems = function(req, res, next) {
    List.find({owner: req._user._id}, function(err, lists) {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }

        if (!lists.length) {
            console.log('No lists');
            res.status(200).json({
                lists: lists,
                items: allItems
            });
        }

    }).then(function(lists) {
        console.log(lists);
        var allItems = [];
        var acc = 0;
        lists.forEach(function(list, index) {
            Item.find({ listID: list.listID}, function(err, listItems) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    let err = {
                        message: err.message
                    };
                    return next(err);
                }
                allItems = allItems.concat(listItems);
                acc ++;
                // If we've iterated through every list, send our response
                if(acc === lists.length) {
                    res.status(200).json({
                        lists: lists,
                        items: allItems
                    });
                }

            }); // end Item.find query

        }); // end lists.forEach iteration
    }); // End List.find query

};

exports.getLists = function(req, res, next) {
    List.aggregate([
        {
            $match: {
                owner: req._user._id
            }
        },
        {
            $lookup: {
                from: 'items',
                localField: 'listID',
                foreignField: 'listID',
                as: 'items'
            }
        }
    ]).then(function(data) {
        var lists = data;
        var items = [];

        lists.forEach(function(value, index) {
            items = items.concat(value.items);
            delete lists[index].items;
        });

        res.status(200).json({
            lists: lists,
            items: items
        });
    }).catch(function(err) {
        console.log('Error:', err);
        res.status(500);
        let error = {
            message: err.message
        };
        return next(error);
    });
}

// POST route - create lists
/*
{
    "listID": "iv3v3mtv",
    "title": "List Title"
}
*/
exports.createList =  function(req, res, next) {
    var list = req.body;
    List.create(list, function(err, list) {
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
exports.updateList = function(req, res, next) {
    var id = req.params.listID;
    var listUpdates = req.body.updates;
    
    // Query our list for our ID, then update it
    List.update({listID: id}, listUpdates, {new: true}, function(err, list) {
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
exports.deleteList = function(req, res, next) {
    var id = req.params.listID;

    // Delete the list
    List.remove({listID: id}, function(err, list) {
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
    Item.remove({listID: id}, function(err, item) {
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
