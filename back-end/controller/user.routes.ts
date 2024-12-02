/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: int64
 *            description: User ID
 *          username:
 *            type: string
 *            description: Username of the user
 *          name:
 *            type: string
 *            description: Full name of the user
 *          email:
 *            type: string
 *            format: email
 *            description: Email address of the user
 *          password:
 *            type: string
 *            format: password
 *            description: Password of the user (hashed)
 *          age:
 *            type: number
 *            format: int32
 *            description: Age of the user
 *          role:
 *            type: string
 *            description: Role of the user (e.g., admin, user)
 */



import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import eventService from '../service/event.service';

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
 *                  $ref: '#/components/schemas/User'
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
 * /users/{email}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by email.
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *           required: true
 *           description: The user's email address.
 *     responses:
 *       200:
 *         description: A user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const events = await eventService.getEventsByUserEmail(req.params.email);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

export { userRouter };