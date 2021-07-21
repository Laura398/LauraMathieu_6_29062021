const logger = require("../logger");

var passwordValidator = require('password-validator');
 
/*Create a schema*/
var schema = new passwordValidator();
 
/*Add properties to it*/
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
 
/*Validate against a password string*/
logger.info(schema.validate('validPASS123'));
/*=> true*/
logger.info(schema.validate('invalidPASS'));
/*=> false*/
 
/*Get a full list of rules which failed*/
logger.info(schema.validate('joke', { list: true }));
/*=> [ 'min', 'uppercase', 'digits' ]*/

/*Entered password validation*/
module.exports = (req, res, next) => {
    if(!schema.validate(req.body.password)){
        res.status(400).json({ error : "le mot de passe n'est pas assez fort : " + schema.validate(req.body.password, {list : true})});
        logger.error("Le mot de passe n'est pas assez fort!")
    }
    else{
        next();
    }
}