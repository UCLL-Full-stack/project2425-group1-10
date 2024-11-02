import express, { Request, Response } from 'express';
import { ParticipantInput } from '../types';
import participantService from '../service/participant.service';

const participantRouter = express.Router();


/**
 * @swagger
 * /participants/{id}:
 *   put:
 *     summary: Update a participant by ID
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the participant to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   role:
 *                     type: string
 *                     enum: [participant, organizer]
 *     responses:
 *       200:
 *         description: the participant is updated correctly.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       400:
 *         description: The requested participant could not be found.
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             age:
 *               type: integer
 *             role:
 *               type: string
 */


participantRouter.put('/:id', (req: Request, res: Response) => {
    const participantId = parseInt(req.params.id);
    const participantInput: ParticipantInput = req.body;

    try {
        const updatedParticipant = participantService.updateParticipant(participantId, participantInput);
        res.status(200).json(updatedParticipant);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

export default participantRouter;
