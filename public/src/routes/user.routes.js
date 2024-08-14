import { Router } from "express";
import { logOutUser, loginUser, registerUser, getUsers, getUserDetails, updateUser, deleteUser, createUser, getUsersDropdown, forgetPassword, resetPassword  } from "../controllers/user.controller.js";
import { upload } from "../middleware/nulter.middleware.js"
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router()
/**
 * @openapi
 * /users/register:
 *   post:
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
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
/**
 * @openapi
 * /users/login:
 *   post:
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
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginUser);




router.post('/logout', logOutUser);
router.post('/create', createUser);
router.get('/list', getUsers);
router.get('/:id/detail', getUserDetails);
router.patch('/:id/update', updateUser);
router.delete('/:id/delete', deleteUser);
router.get('/users-dropdown', getUsersDropdown);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);

export default router