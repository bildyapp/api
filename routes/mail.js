const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/session")
//const checkRol = require("../middleware/rol")
const { validatorMail } = require("../validators/mail")
const { send } = require("../controllers/mail")

/**
 * @openapi
 * /api/mail:
 *  post:
 *      tags:
 *      - Mail
 *      summary: Sending email
 *      description: 'Sends an email'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/mail"
 *      responses:
 *          '200':
 *              description: OK. Returns the inserted object
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/", authMiddleware, validatorMail, send)

module.exports = router