/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum:
 *         - ADMIN
 *         - PARTICIPANT
 *         - ORGANIZER
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: password123
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username.
 *         name:
 *           type: string
 *           description: User name.
 *         email:
 *           type: string
 *           description: E-mail.
 *         password:
 *           type: string
 *           description: User password.
 *         age:
 *           type: integer
 *           description: Age.
 *         lastName:
 *           type: string
 *           description: Last name.
 *         role:
 *           $ref: '#/components/schemas/Role'
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Event Name
 *         date:
 *           type: string
 *           format: date
 *           example: 2023-10-01
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import eventService from '../service/event.service';
import { UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users.
 *     description: Returns JSON array of users, each item in the array is of type User.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error occurred while fetching the list of users.
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
* /users/signup:
*   post:
*     summary: Create a new user
*     tags:
*       - Users
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserInput'
*     responses:
*       200:
*         description: The newly created user.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                   description: JWT access token.
*                 user:
*                   $ref: '#/components/schemas/User'
*/
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: UserInput = req.body;
        const createdUser = await userService.createUser(userInput);

        res.status(200).json(createdUser);
    } catch (error){

        next(error);
    }
})

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: john.doe@ucll.be
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: passwordJohn
 *     responses:
 *       200:
 *         description: The token of the logged in user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authentication(userInput);
        res.status(200).json({ message: 'Authentication successful', ... response});
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: "Incorrect username or password.", type: 'error'});
        } else {
            next(error);
        }
    }
})

userRouter.put('/:email/favorite-events/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const eventId = parseInt(req.params.eventId);
        await userService.addEventToFavorite(email, eventId);
        res.status(200).json({ message: 'Event added to favorites' });
    } catch (error) {
        next(error);
    }
})

userRouter.get('/:email/favorite-events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const favoriteEvents = await userService.getFavoriteEventsByUserEmail(email);
        res.status(200).json(favoriteEvents);
    } catch (error) {
        next(error);
    }
})

export { userRouter };