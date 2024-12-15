import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import eventService from '../service/event.service';
import { UserInput } from '../types';

const userRouter = express.Router();

//get all users
/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Sign up a new user.
 *     description: Registers a new user and returns the user information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Successfully signed up a new user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or missing fields.
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        //failed here
        const userInput: UserInput = req.body;
        const createdUser = await userService.createUser(userInput);

        res.status(200).json(createdUser);
    } catch (error) {

        next(error);
    }
})

/**
 * @swagger
 * /login:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: User login.
 *     dyeaescription: Authenticates a user by username and password, and returns a JWT token for future requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationRequest'
 *     responses:
 *       200:
 *         description: Successful login with JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Invalid username or password.
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authentication(userInput);
        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: "Incorrect username or password.", type: 'error' });
        } else {
            next(error);
        }
    }

})

export { userRouter };