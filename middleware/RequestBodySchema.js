const schema = require('schemajs');
const flatten = require('flatten');
const unflatten = flatten.unflatten;

// Filter the request body to ensure it matches our expected format
const SchemaFilter =  {
    validateBody: function(req, res, next) {
        let flatObj = flatten(req.body);

        let model = schema.create({
            'name':                    { type: 'string', required: true, error: { required: 'No name was provided.' } },
            'email':                   { type: 'string', filters:'lowercase', required: true, error: { required: 'No email was provided.' } },
            'password':                { type: 'string', required: true, error: { required: 'No password was provided' } },
            'settings.accountType':    { type: 'string', required: true,  error: { required: 'No accountType was provided.' } },
            'settings.preferences':    { type: 'string', required: true,  error: { required: 'No preferences were provided.' } }
        });

        let test = model.validate(flatObj);

        if (!test.valid) {

            res.status(400);
            let err = getError(test.errors);
            return next(err);

        }

        let passTest = unflatten(test.data);
        req._data = passTest;

        next();
    }
}

function getError(errorObj) {
    let keys = Object.keys(errorObj);
    let err = new Error(errorObj[ keys[0] ]);
    return err;
}

export default SchemaFilter;