const express = require("express")
const { registerCtrl, inviteCtrl, registerGoogle, registerCompleteCtrl, loginCtrl, validateEmail, validateEmailRecover, recoverPass } = require("../controllers/auth")
const { getUser, updateAddr, updateRole, updateCompany, updatePass, updateImage, updateNotifications, deleteUser } = require("../controllers/user")
const { validatorEmail, validatorEmailRecover, validatorNotifications, validatorRegister, validatorInvite, validatorRegisterComplete, validatorLogin, validatorAddr, validatorRole, validatorCompany, validatorPass, validatorEmailCode, validatorGoogle }
    = require("../validators/user")
const authMiddleware = require("../middleware/session")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")
const checkRol = require("../middleware/rol")
const router = express.Router()

/**
 * @openapi
 * /api/user:
 *  get:
 *      tags:
 *      - User
 *      summary: Get user
 *      description: 'Retrieves user information using a JWT token'
 *      responses:
 *          '200':
 *              description: Returns the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userDataAll"
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/", authMiddleware, getUser)

/**
 * @openapi
 * /api/user/google:
 *  post:
 *      tags:
 *      - User
 *      summary: User registration with Google account
 *      description: Registers a new user from Google account
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/google"
 *      responses:
 *          '200':
 *              description: Returns the user's data.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 */
router.post("/google", validatorGoogle, registerGoogle)

/**
 * @openapi
 * /api/user/register:
 *  post:
 *      tags:
 *      - User
 *      summary: User registration
 *      description: Registers a new user with an email and password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          '200':
 *              description: Returns the inserted object and JWT Token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userData"
 *          '409':
 *              description: User exists.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error.
 */
router.post("/register", validatorRegister, registerCtrl)

/**
 * @openapi
 * /api/user/invite:
 *  post:
 *      tags:
 *      - User
 *      summary: User invitation
 *      description: Registers a new user with invitation
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/userInvitation"
 *      responses:
 *          '200':
 *              description: Returns the inserted object and JWT Token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userData"
 *          '409':
 *              description: User exists.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error.
 */
router.post("/invite", authMiddleware, checkRol(["admin"]), validatorInvite, inviteCtrl)

/**
 * @openapi
 * /api/user/register:
 *  put:
 *      tags:
 *      - User
 *      summary: "User registration complete"
 *      description: Register a new user with all required data
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/user"
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userDataComplete"
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/register", authMiddleware, validatorRegisterComplete, registerCompleteCtrl)

/**
 * @openapi
 * /api/user/validation:
 *  put:
 *      tags:
 *      - User
 *      summary: "User email validation"
 *      description: Validates the user's mail
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/mailCode"
 *      responses:
 *          '200':
 *              description: Ok. Changes status field to 1 and returns an object with acknowledged to true
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/validation", authMiddleware, validatorEmailCode, validateEmail)

/**
 * @openapi
 * /api/user/validation:
 *  post:
 *      tags:
 *      - User
 *      summary: "User email validation to recover password"
 *      description: Validates the user's mail
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/mailRecover"
 *      responses:
 *          '200':
 *              description: Ok. Returns user and token to change the password
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 */
router.post("/validation", validatorEmailRecover, validateEmailRecover)

/**
 * @openapi
 * /api/user/login:
 *  post:
 *      tags:
 *      - User
 *      summary: "User login"
 *      description: Login a user with email and password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          '200':
 *              description: Ok. Returns the JWT Token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userDataLogin"
 *          '401':
 *              description: User is not validated.
 *          '404': 
 *              description: User not found.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 */
router.post("/login", validatorLogin, loginCtrl)

/**
 * @openapi
 * /api/user/address:
 *  patch:
 *      tags:
 *      - User
 *      summary: "Adding user address"
 *      description: Adds user address
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/userAddr"
 *      responses:
 *          '200':
 *              description: OK. Set the address object and returns acknowledged true
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/address", authMiddleware, validatorAddr, updateAddr)


/**
 * @openapi
 * /api/user/role:
 *  patch:
 *      tags:
 *      - User
 *      summary: "Changing user role"
 *      description: Changes user role
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/userRole"
 *      responses:
 *          '200':
 *              description: OK. Set the user role from guest to user and returns acknowledged true
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/role", authMiddleware, validatorRole, updateRole)

/**
 * @openapi
 * /api/user/company:
 *  patch:
 *      tags:
 *      - User
 *      summary: "Adding user company"
 *      description: Adds user company
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/userCompany"
 *      responses:
 *          '200':
 *              description: OK. Set the company object and returns acknowledged true
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/company", authMiddleware, validatorCompany, updateCompany)

/**
 * @openapi
 * /api/user/password:
 *  patch:
 *      tags:
 *      - User
 *      summary: "Changing user password"
 *      description: Changes user password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/userPass"
 *      responses:
 *          '200':
 *              description: OK. Set the user password and returns acknowledged true
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/password", authMiddleware, validatorPass, updatePass)

/**
 * @openapi
 * /api/user/recover:
 *  post:
 *      tags:
 *      - User
 *      summary: "Recover token"
 *      description: Recover user token to validate and change password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/mailUser"
 *      responses:
 *          '200':
 *              description: OK. Send mail with code to verify.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/userDataRecover"
 *          '404':
 *              description: User email not found.
 *          '409':
 *              description: User is not validated.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 */
router.post("/recover", validatorEmail, recoverPass)

/**
 * @openapi
 * /api/user/notifications:
 *  patch:
 *      tags:
 *      - User
 *      summary: "Allow notifications"
 *      description: Allows notifications
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/notifications"
 *      responses:
 *          '200':
 *              description: OK. Set notificacions a true and returns ack.
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/notifications", authMiddleware, validatorNotifications, updateNotifications)

/**
 * @openapi
 * /api/user:
 *  delete:
 *      tags:
 *      - User
 *      summary: Delete user
 *      description: Delete a user by id in JWT Token
 *      responses:
 *          '200':
 *              description: OK. Returns the status
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/", authMiddleware, deleteUser)


//router.get("/", authMiddleware, checkRol(["admin"]), getItems)
//router.get("/:id", authMiddleware, checkRol(["admin"]), getItem)

/**
 * @openapi
 * /api/user/logo:
 *  patch:
 *      tags:
 *      - User
 *      summary: Upload logo and update its url
 *      description: Upload logo and update its url
 *      responses:
 *          '200':
 *              description: Returns the status.
 *          '401':
 *              description: Unauthorized.Authentication token is missing or invalid.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/logo", authMiddleware, uploadMiddlewareMemory.single("image"), updateImage)



module.exports = router
