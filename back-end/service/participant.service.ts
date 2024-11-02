import { Participant } from "../model/participant";
import participantDb from "../repository/participant.db";
import { ParticipantInput, UserInput } from "../types";
import { User } from "../model/user";

const getAllParticipants = (): Participant[] => participantDb.getAllParticipants();

const updateParticipant = (id: number, participantInput: ParticipantInput): Participant => {
    const participant = participantDb.getAllParticipants().find(p => p.getId() === id);

    if (!participant) {
        throw new Error('Participant not found');
    }

    // New user with updated details: 
    const updatedUser = new User({
        id: participant.getUser().getId(),
        username: participantInput.user.username,
        name: participantInput.user.name,
        email: participantInput.user.email,
        password: participantInput.user.password,
        age: participantInput.user.age,
        role: participantInput.user.role,
    });

    // Now we are creating the P instance with the info of the new user: 
    const updatedParticipant = new Participant({
        id: participant.getId(),
        user: updatedUser,
    });

    // This updates the participant
    const participants = participantDb.getAllParticipants();
    const index = participants.findIndex(p => p.getId() === id);
    participants[index] = updatedParticipant;

    return updatedParticipant;
};

export default { getAllParticipants, updateParticipant };
