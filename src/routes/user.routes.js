import { Router } from 'express';
import { logOutUser, loginUser, registerUser, getUsers, getUserDetails, updateUser, deleteUser, createUser, getUsersDropdown, forgetPassword, resetPassword } from '../controllers/user.controller.js';
import { upload } from '../middleware/nulter.middleware.js';
import { jwtVerify } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User management operations
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     description: Registers a new user and returns user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: password123
 *               clientId:
 *                 type: string
 *                 example: clientId123
 *               department:
 *                 type: string
 *                 example: IT
 *               role:
 *                 type: string
 *                 example: Developer
 *               status:
 *                 type: string
 *                 example: active
 *               phoneNumber:
 *                 type: string
 *                 example: +123456789
 *               createdDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-08-15
 *               updatedDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-08-15
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 */
router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser
);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [User]
 *     summary: Login a user
 *     description: Logs in a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginUser);




router.post('/:id/logout', logOutUser);
router.post('/create', createUser);

/**
 * @openapi
 * /users/list:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     description: Retrieves a list of all users with optional filters.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/list', getUsers);

/**
 * @openapi
 * /users/{id}/detail:
 *   get:
 *     tags: [User]
 *     summary: Get user details by ID
 *     description: Retrieves details of a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id/detail', getUserDetails);

/**
 * @openapi
 * /users/{id}/update:
 *   patch:
 *     tags: [User]
 *     summary: Update user details by ID
 *     description: Updates details of a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               department:
 *                 type: string
 *                 example: IT
 *               status:
 *                 type: string
 *                 example: active
 *               phoneNumber:
 *                 type: string
 *                 example: +123456789
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/update', updateUser);

/**
 * @openapi
 * /users/{id}/delete:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by ID
 *     description: Deletes a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id/delete', deleteUser);

/**
 * @openapi
 * /users/users-dropdown:
 *   get:
 *     tags: [User]
 *     summary: Get users dropdown
 *     description: Retrieves a list of users for a dropdown selection.
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users-dropdown', getUsersDropdown);

/**
 * @openapi
 * /users/forget-password:
 *   post:
 *     tags: [User]
 *     summary: Forget password
 *     description: Handles forget password requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Bad Request
 */
router.post('/forget-password', forgetPassword);

/**
 * @openapi
 * /users/reset-password/{token}:
 *   put:
 *     tags: [User]
 *     summary: Reset password
 *     description: Resets the user password using a token.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Token not found
 */
router.put('/reset-password/:token', resetPassword);

export default router;
