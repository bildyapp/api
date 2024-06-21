const express = require("express")
const router = express.Router()
const { uploadMiddleware, uploadMiddlewareMemory } = require("../utils/handleStorage")
const authMiddleware = require("../middleware/session")
const { validatorGetItem, validatorDeliveryNote, validatorCode, validatorSign, validatorObservations, validatorClose } = require("../validators/deliveryNote")
const {
    getDeliveryAllNotes,
    getDeliveryNotes,
    getDeliveryNote,
    createDeliveryNote,
    updateDeliveryNote,
    closeDeliveryNote,
    updateInternalCode,
    updateSign,
    updateObservations,
    updatePDF,
    updateSignImage,
    deleteDeliveryNote,
    updateSignImage2,
    downloadPDF,
    testPDF
} = require("../controllers/deliveryNote")

/**
 * @openapi
 * /api/deliverynote:
 *  get:
 *      tags:
 *      - DeliveryNote
 *      summary: Get Delivery Notes of a user
 *      description: 'Retrieves Delivery Notes from a user'

 *      responses:
 *          '200':
 *              description: OK. Returns the delivery notes of a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/deliveryNoteList"
 *          '401':
 *              description: Unauthorized.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/", authMiddleware, getDeliveryAllNotes)


/**
 * @openapi
 * /api/deliverynote/project/{projectId}:
 *  get:
 *      tags:
 *      - DeliveryNote
 *      summary: Get Delivery Notes of a project
 *      description: 'Retrieves Delivery Notes from a project'
 *      parameters:
 *          -   name: projectId
 *              in: path
 *              description: ID of the project to retrieve delivery notes for
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: OK. Returns the delivery notes of a project
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/deliveryNoteList"
 *          '401':
 *              description: Unauthorized.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/project/:id", authMiddleware, validatorGetItem, getDeliveryNotes)

/**
 * @openapi
 * /api/deliverynote/{id}:
 *  get:
 *      tags:
 *      - DeliveryNote
 *      summary: Get Delivery Note
 *      description: 'Retrieves a specific Delivery Note'
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to retrieve
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: OK. Returns the delivery note.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/deliveryNoteDataComplete"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:id", authMiddleware, validatorGetItem, getDeliveryNote)

/**
 * @openapi
 * /api/deliverynote:
 *  post:
 *      tags:
 *      - DeliveryNote
 *      summary: Adding Delivery Note
 *      description: 'Adds a delivery note'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/deliveryNote"
 *      responses:
 *          '200':
 *              description: Returns the inserted delivery note object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/deliveryNoteData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/", authMiddleware, validatorDeliveryNote, createDeliveryNote)

/**
 * @openapi
 * /api/deliverynote/{id}:
 *  put:
 *      tags:
 *      - DeliveryNote
 *      summary: Update a Delivery Note
 *      description: Updates delivery note's data
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/deliveryNote"
 *      responses:
 *          '200':
 *              description: Returns the updated delivery note object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/deliveryNoteData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", authMiddleware, validatorGetItem, validatorDeliveryNote, updateDeliveryNote)

/**
 * @openapi
 * /api/deliverynote/close/{id}:
 *  patch:
 *      tags:
 *      - DeliveryNote
 *      summary: Close a delivery note
 *      description: Closes a delivery note
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/close"
 *      responses:
 *          '200':
 *              description: Returns ack
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/close/:id", authMiddleware, validatorGetItem, validatorClose, closeDeliveryNote)

/**
* @openapi
* /api/deliverynote/code/{id}:
*  patch:
*      tags:
*      - DeliveryNote
*      summary: "Setting internal project Id"
*      description: Changes internal projectId
*      parameters:
*          -   name: id
*              in: path
*              description: ID of the delivery note to be updated
*              required: true
*              schema:
*                  type: string 
*      requestBody:
*          content:
*              application/json:
*                  schema:
*                      $ref: "#/components/schemas/internalCode"
*      responses:
*          '200':
*              description: Returns the updated object
*          '401':
*              description: Unauthorized. Authentication token is missing or invalid.
*          '422':
*              description: Validation error. The request body contains invalid fields.
*          '500':
*              description: Internal server error
*      security:
*          - bearerAuth: []
*/
router.patch("/code/:id", authMiddleware, validatorGetItem, validatorCode, updateInternalCode)

/**
 * @openapi
 * /api/deliverynote/sign/{id}:
 *  patch:
 *      tags:
 *      - DeliveryNote
 *      summary: "Setting sign"
 *      description: Changes path to the sign
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string 
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/sign"
 *      responses:
 *          '200':
 *              description: OK. Returns the updated object
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/sign/:id", authMiddleware, validatorGetItem, validatorSign, updateSign)


/**
 * @openapi
 * /api/deliverynote/observations/{id}:
 *  patch:
 *      tags:
 *      - DeliveryNote
 *      summary: "Setting observations"
 *      description: Changes observations
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string 
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/observations"
 *      responses:
 *          '200':
 *              description: OK. Returns the updated object
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/observations/:id", authMiddleware, validatorGetItem, validatorObservations, updateObservations)

/**
 * @openapi
 * /api/deliverynote/signimage/{id}:
 *  patch:
 *      tags:
 *      - DeliveryNote
 *      summary: Upload sign file and update its url
 *      description: Upload sign and update its url
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string
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
router.patch("/signimage/:id", authMiddleware, uploadMiddlewareMemory.single("image"), updateSignImage2)
//router.patch("/signimage/:id", authMiddleware, uploadMiddleware.single("image"), updateSignImage)

/**
 * @openapi
 * /api/deliverynote/pdf/{id}:
 *  patch:
 *      tags:
 *      - DeliveryNote
 *      summary: "Setting delivery note PDF"
 *      description: Creates pdf and changes path to the pdf
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: OK. Returns ACK.
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.patch("/pdf/:id", authMiddleware, validatorGetItem, updatePDF)

/**
 * @openapi
 * /api/deliverynote/pdf/{id}:
 *  get:
 *      tags:
 *      - DeliveryNote
 *      summary: "Download deliverynote.PDF"
 *      description: Creates pdf stream
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be updated
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: OK. Returns PDF.
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/pdf/:id", authMiddleware, validatorGetItem, downloadPDF)
//router.get("/pdf/:id", authMiddleware, validatorGetItem, testPDF)

/**
 * @openapi
 * /api/deliverynote/{id}:
 *  delete:
 *      tags:
 *      - DeliveryNote
 *      summary: Delete delivery note
 *      description: Delete a delivery note
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the delivery note to be deleted
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: OK. Returns the status
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", authMiddleware, validatorGetItem, deleteDeliveryNote)


module.exports = router