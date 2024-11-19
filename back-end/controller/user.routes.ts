import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import eventService from '../service/event.service';

const userRouter = express.Router();

//get all users
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

userRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const events = await eventService.getEventsByUserEmail(req.params.email);
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.login(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
};

export { userRouter };