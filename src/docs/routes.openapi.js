/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: Returns a paginated, sortable list of users. Supports delay and error simulation.
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - $ref: '#/components/parameters/orderParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '201':
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by id
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   put:
 *     tags: [Users]
 *     summary: Replace a user
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '200':
 *         description: The replaced user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   patch:
 *     tags: [Users]
 *     summary: Partially update a user
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: 'string' }
 *               username: { type: 'string' }
 *               email: { type: 'string', format: 'email' }
 *               role: { type: 'string', enum: ['admin', 'author', 'reader', 'editor'] }
 *               active: { type: 'boolean' }
 *     responses:
 *       '200':
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       '200':
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 */

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: List posts
 *     description: Returns a paginated, sortable list of posts. Supports delay and error simulation.
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - $ref: '#/components/parameters/orderParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: Paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   post:
 *     tags: [Posts]
 *     summary: Create a post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       '201':
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by id
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   put:
 *     tags: [Posts]
 *     summary: Replace a post
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       '200':
 *         description: The replaced post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   patch:
 *     tags: [Posts]
 *     summary: Partially update a post
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: 'integer' }
 *               title: { type: 'string' }
 *               body: { type: 'string' }
 *               tags: { type: 'array', items: { type: 'string' } }
 *               published: { type: 'boolean' }
 *     responses:
 *       '200':
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       '200':
 *         description: The deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 */

/**
 * @openapi
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments
 *     description: Returns a paginated, sortable list of comments. Supports delay and error simulation.
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortParam'
 *       - $ref: '#/components/parameters/orderParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: Paginated list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       '201':
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 * /api/comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get a comment by id
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *       - $ref: '#/components/parameters/delayParam'
 *       - $ref: '#/components/parameters/statusParam'
 *     responses:
 *       '200':
 *         description: The requested comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   put:
 *     tags: [Comments]
 *     summary: Replace a comment
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       '200':
 *         description: The replaced comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   patch:
 *     tags: [Comments]
 *     summary: Partially update a comment
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId: { type: 'integer' }
 *               body: { type: 'string' }
 *     responses:
 *       '200':
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '422':
 *         $ref: '#/components/responses/ValidationFailed'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       '200':
 *         description: The deleted comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       default:
 *         $ref: '#/components/responses/UnexpectedError'
 */
