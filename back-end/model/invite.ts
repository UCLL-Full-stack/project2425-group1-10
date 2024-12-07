export class Invite {
    private id?: number;
    private status: 'pending' | 'confirmed' | 'declined';
    private email: string;

    constructor(invite: {
        id?: number,
        status: 'pending' | 'confirmed' | 'declined',
        email: string;
    }) {
        //status validation: needs to be one of the three
        if (invite.status !== 'pending' && invite.status !== 'confirmed' && invite.status !== 'declined') {
            throw new Error('Invalid status.');
        }

        //email can not be empty
        if (!invite.email) {
            throw new Error('Email can not be empty.'); // Retained for empty email check
        }

        //validation for the email: => simplify later.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(invite.email)) {
            throw new Error('Invalid email format'); // Updated error message
        }



        this.id = invite.id;
        this.status = invite.status;
        this.email = invite.email;
    }

    getId(): number | undefined {
        return this.id;
    }

    getStatus(): string {
        return this.status
    }

    getEmail(): string {
        return this.email
    }

    equals(invite: Invite): boolean {
        return (
            this.status === invite.getStatus() &&
            this.email === invite.getEmail()
        )
    }
}
