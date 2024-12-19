/**
 * @swagger
 * tags:
 *   name: Invites
 *   description: API for managing invites
 * components:
 *   schemas:
 *     Invite:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - eventId
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the invite
 *         email:
 *           type: string
 *           description: The email of the user invited
 *         eventId:
 *           type: string
 *           description: The id of the event
 *         status:
 *           type: string
 *           description: The status of the invite (e.g., pending, accepted, declined)
 *       example:
 *         id: d5fE_asz
 *         email: user@example.com
 *         eventId: 12345
 *         status: pending
 */
import express, { NextFunction, Request, Response } from 'express';
import inviteService from '../service/invite.service';

const inviteRouter = express.Router();

/**
 * @swagger
 * /invites:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all invites.
 *     description: Returns JSON array of invites, each item in the array is of type Invite.
 *     tags:
 *       - Invites
 *     responses:
 *       200:
 *         description: A list of invites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Error occurred while fetching the list of invites.
 */
inviteRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invites = await inviteService.getAll();
        res.status(200).json(invites);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

// Create an invitation
/**
 * @swagger
 * /invites:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create an invite.
 *     description: Create an invite with the given email and eventId.
 *     tags:
 *       - Invites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The invite was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Error occurred while creating the invite.
 */
inviteRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail = req.body.email;

        if (!userEmail) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const eventId = req.body.eventId;

        if (!eventId) {
            res.status(400).json({ message: 'Event ID is required.' });
            return;
        }

        const invite = await inviteService.createInvite(userEmail, eventId);
        res.status(200).json(invite);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

// Get invites by event id
/**
 * @swagger
 * /invites/{eventId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of invites by event id.
 *     description: Returns JSON array of invites, each item in the array is of type Invite.
 *     tags:
 *       - Invites
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of invites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Error occurred while fetching the list of invites.
 */
inviteRouter.get('/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId;

        if (!eventId) {
            res.status(400).json({ message: 'Event ID is required.' });
            return;
        }

        const invites = await inviteService.getInvitesByEventId(eventId);
        res.status(200).json(invites);

    } catch (error) {

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

// Get invites by user email
/**
 * @swagger
 * /invites/user/{email}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of invites by user email.
 *     description: Returns JSON array of invites, each item in the array is of type Invite.
 *     tags:
 *       - Invites
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of invites.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Error occurred while fetching the list of invites.
 */
inviteRouter.get('/user/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;

        if (!email) {
            res.status(400).json({ message: 'Email is required.' });
            return;
        }

        const invites = await inviteService.getInvitesByUserEmail(email);

        res.status(200).json(invites);

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

// Update invite status
/**
 * @swagger
 * /invites/status/{inviteId}/{answer}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update invite status.
 *     description: Update the status of the invite with the given inviteId.
 *     tags:
 *       - Invites
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: answer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The invite status was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Error occurred while updating the invite status.
 */
inviteRouter.put('/status/:inviteId/:answer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inviteId = req.params.inviteId;

        if (!inviteId) {
            res.status(400).json({ message: 'Invite ID is required.' });
            return;
        }

        const status = req.params.answer;

        if (!status) {
            res.status(400).json({ message: 'Status is required.' });
            return;
        }

        const inviteStatusChange = await inviteService.changeInviteStatus(inviteId, status);
        res.status(200).json(inviteStatusChange);
        
    } catch (error) {

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
})

export { inviteRouter };