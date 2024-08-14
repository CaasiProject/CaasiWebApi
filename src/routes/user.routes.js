import { Router } from "express";
import { logOutUser, loginUser, registerUser, getUsers, getUserDetails, updateUser, deleteUser, createUser, getUsersDropdown, forgetPassword, resetPassword } from "../controllers/user.controller.js";
import { upload } from "../middleware/nulter.middleware.js"
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router()

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

router.post('/register', registerUser);
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