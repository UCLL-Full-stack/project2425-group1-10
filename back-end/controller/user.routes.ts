import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import eventService from '../service/event.service';
import { UserInput } from '../types';

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

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        //failed here
        const userInput: UserInput = req.body;
        const createdUser = await userService.createUser(userInput);

        res.status(200).json(createdUser);
    } catch (error){

        next(error);
    }
})

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