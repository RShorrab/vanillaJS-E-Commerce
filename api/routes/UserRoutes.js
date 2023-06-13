const router = require("express").Router();
const validation = require("../middleware/validation")
const inputValidator = require("../middleware/inputValidation")
const userController = require("../controllers/UserController")

//const router = express.Router();

router.post("/register", validation(inputValidator.signupValidation), userController.signup);
router.post("/login", validation(inputValidator.signinValidation), userController.signin);

module.exports = router; 
