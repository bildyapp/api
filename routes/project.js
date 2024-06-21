
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/session")
const { validatorGetItem, validatorGetItems, validatorProject, validatorCompleteProject, validatorActivate } = require("../validators/project")
const { getProjects, getProject, createProject, updateProject, activateProject, deleteProject } = require("../controllers/project")

/**
 * @openapi
 * /api/project/{client}:
 *  get:
 *      tags:
 *      - Project
 *      summary: Get projects
 *      description: 'Retrieves projects from a client ID'
 *      parameters:
 *          -   name: client
 *              in: path
 *              description: ID of the client to retrieve projects for
 *              required: true
 *              schema:
 *                  type: string 
 *      responses:
 *          '200':
 *              description: Returns a list of a user's client projects.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/projectDataList"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:id", authMiddleware, validatorGetItem, getProjects)

/**
 * @openapi
 * /api/project/{client}/{id}:
 *  get:
 *      tags:
 *      - Project
 *      summary: Get a project
 *      description: 'Retrieves a project from a client ID and project ID'
 *      parameters:
 *          -   name: client
 *              in: path
 *              description: Client id
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: id
 *              in: path
 *              description: ID of the project to retrieve
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: OK. Returns a user's client project
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/projectDataComplete"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:clientId/:id", authMiddleware, validatorGetItems, getProject)

/**
 * @openapi
 * /api/project:
 *  post:
 *      tags:
 *      - Project
 *      summary: Adding project
 *      description: 'Adds a project'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/projects"
 *      responses:
 *          '200':
 *              description: Returns the inserted project object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/projectData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/", authMiddleware, validatorProject, createProject)

/**
 * @openapi
 * /api/project/{id}:
 *  put:
 *      tags:
 *      - Project
 *      summary: Update project
 *      description: Adds project's data
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the project to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/projectComplete"
 *      responses:
 *          '200':
 *              description: Returns the updated project object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/projectData"
 *          '401':
 *              description: Unauthorized. Authentication token is missing or invalid.
 *          '422':
 *              description: Validation error. The request body contains invalid fields.
 *          '500':
 *              description: Internal server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", authMiddleware, validatorGetItem, validatorCompleteProject, updateProject)

/**
 * @openapi
 * /api/project/activate/{id}:
 *  patch:
 *      tags:
 *      - Project
 *      summary: Activate or desactivate project
 *      description: Activate or desactivate project
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the project to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/active"
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
router.patch("/activate/:id", authMiddleware, validatorGetItem, validatorActivate, activateProject)

/**
 * @openapi
 * /api/project/{client}/{id}:
 *  delete:
 *      tags:
 *      - Project
 *      summary: Delete project
 *      description: Deletes a project of a client
 *      parameters:
 *          -   name: client
 *              in: path
 *              description: Client ID
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: id
 *              in: path
 *              description: ID of the project to be deleted
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
router.delete("/:clientId/:id", authMiddleware, validatorGetItems, deleteProject)


module.exports = router
