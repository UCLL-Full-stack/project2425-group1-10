import express, { NextFunction, Request, Response } from 'express';
import inviteService from '../service/invite.service';

const inviteRouter = express.Router();

inviteRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invites = await inviteService.getAll();
        res.status(200).json(invites);
    } catch (error) {
        next(error);
    }
});

// Create an invitation
inviteRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmails = req.body.emails;
        const eventId = req.body.eventId;
        const invite = await inviteService.createInvite(userEmails, eventId);
        res.status(200).json(invite);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

inviteRouter.get('/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId;
        const invites = await inviteService.getInvitesByEventId(eventId);
        res.status(200).json(invites);
    } catch (error) {
        next(error);
    }
});

inviteRouter.get('/user/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const invites = await inviteService.getInvitesByUserEmail(email);
        res.status(200).json(invites);
    } catch (error) {
        next(error);
    }
});

inviteRouter.put('/status/:inviteId/:answer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inviteId = req.params.inviteId;
        const status = req.params.answer;
        const inviteStatusChange = await inviteService.changeInviteStatus(inviteId, status);
        res.status(200).json(inviteStatusChange);
    } catch (error) {
        next(error);
    }
})

export { inviteRouter };