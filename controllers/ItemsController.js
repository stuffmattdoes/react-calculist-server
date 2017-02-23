const   Item = require('../models/Item');
        List = require('../models/List');

// ==================================================
// Items Route
// ==================================================

// GET route - receive all items
exports.getItems = (req, res, next) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
        res.status(200).json({
            items: items
        });
        return next();
    });
};

// GET route - receive items for current list
exports.getItemsForList = (req, res, next) => {
    var id = req.params.listID;

    Item.find({ listID: id}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }

        res.status(200).json({
            items: items
        });
        return next();
    });
};

// POST route - create items
/*
{
    "title": "Item Title",
    "itemID": "iv2rsurb",       - the ID of this item
    "listID": "iv3v3mtv"        - the ID of the list this item belongs to
}

*/
exports.createItem = (req, res, next) => {
    var item = req.body;
    Item.create(item, (err, item) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
        res.status(200).json({
            "item": item,
            "message": "Item created."
        });
        return next();
    });
};

// PUT route - update existing items
/*
{
    "_id": "583bc4ce1a7e726b2c915cd6"
}
*/

var newKeyName;

exports.updateItem = (req, res, next) => {
    var id = req.params.itemID;
    var itemUpdates = req.body.updates;
    newKeyName = '';

    // If our update object is nested, reduce it to dot notation
    for (var key in itemUpdates) {
        if (typeof itemUpdates[key] === 'object') {
            itemUpdates = getKeyValuePair(itemUpdates);
        }
    }

    Item.update({ itemID: id }, itemUpdates, {new: true}, (err, item) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
        // console.log('Item upated', itemUpdates);
        res.status(200).json({
            "item": item,
            successMessage: "Item updated"
        });
        return next();
    });
};

function getKeyValuePair(updates) {
    var newKeyValuePair = updates;
    var newKeyPair = {};

    for (var key in updates) {
        if (newKeyName !== '') {
            newKeyName += '.' + key;
        } else {
            newKeyName += key;
        }

        if (typeof updates[key] === 'object') {
            newKeyPair = getKeyValuePair(updates[key]);
        } else {
            newKeyPair[newKeyName] = updates[key];
        }

        return newKeyPair;
    }
}

// DELETE route - delete existing items
/*
{
    "_id": "583bc4ce1a7e726b2c915cd6"
}
*/
exports.deleteItem = (req, res, next) => {
    var id = req.params.itemID;

    Item.remove({ itemID: id }, (err, item) => {
        if (err) {
            console.log(err);
            res.status(500);
            let err = {
                message: err.message
            };
            return next(err);
        }
        res.status(200).json({
            successMessage: "Item deleted"
        });
        return next();
    });

};