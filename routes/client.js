
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/session")
const { uploadMiddleware, uploadMiddlewareMemory } = require("../utils/handleStorage")
const { validatorGetItem, validatorClient, validatorCompleteClient } = require("../validators/client")
const { getClients, getClient, createClient, updateClient, updateImage, updateImage2, deleteClient} = require("../controllers/client")

/**
 * @openapi
 * /api/client:
 *  get:
 *      tags:
 *      - Client
 *      summary: Get clients
 *      description: 'Retrieves a list of clients associated with the user.'
 *      responses:
 *          '200':
 *              description: OK. Returns the list of user's clients.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/clientDataList"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '500':
 *              description: Internal server error.
 *      security:
 *          - bearerAuth: []
 */
router.get("/", authMiddleware, getClients)

/**
 * @openapi
 * /api/client/{id}:
 *  get:
 *      tags:
 *      - Client
 *      summary: Get client
 *      description: 'Retrieves a specific client associated with the user.'
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the client to retrieve
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: OK. Returns the specified client.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/clientDataComplete"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:id", authMiddleware, validatorGetItem, getClient)

/**
 * @openapi
 * /api/client:
 *  post:
 *      tags:
 *      - Client
 *      summary: Add client
 *      description: 'Adds a new client.'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/clients"
 *      responses:
 *          '200':
 *              description: OK. Returns the inserted client.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/clientData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/", authMiddleware, validatorClient, createClient)

/**
 * @openapi
 * /api/client/{id}:
 *  put:
 *      tags:
 *      - Client
 *      summary: Update client
 *      description: Updates client data
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the client to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/clientComplete"
 *      responses:
 *          '200':
 *              description: OK. Returns the updated client object.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/clientData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
 router.put("/:id", authMiddleware, validatorGetItem, validatorCompleteClient, updateClient)


/**
 * @openapi
 * /api/client/{id}:
 *  delete:
 *      tags:
 *      - Client
 *      summary: Delete client
 *      description: Deletes a client by ID
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the client to be deleted
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns the status.
 *          '401':
 *              description: Unauthorized.Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", authMiddleware, validatorGetItem, deleteClient)

/**
 * @openapi
 * /api/client/logo/{id}:
 *  patch:
 *      tags:
 *      - Client
 *      summary: Upload logo and update its url
 *      description: Upload logo and update its url
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the client to be updated
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
router.patch("/logo/:id", authMiddleware, uploadMiddlewareMemory.single("image"), updateImage2)

//router.patch("/logoOld/:id", authMiddleware, uploadMiddleware.single("image"), updateImage)


module.exports = router
