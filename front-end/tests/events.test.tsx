import EventOverview from "@components/events/EventOverview";

const events = [
    {
        id: 0,
        start: new Date(),
        end: new Date(),
        name: "Tech Conference 2024",
        description: "Annual technology conference focusing on AI and robotics.",
        category: "Technology",
        location: "San Francisco, CA",
        backgroundImage: "https://example.com/tech-conference-bg.jpg",
        isTrending: true,
    },
    {
        id: 1,
        start: new Date(),
        end: new Date(),
        name: "Startup Pitch Night",
        description: "An evening where startups pitch their ideas to investors.",
        category: "Entrepreneurship",
        location: "New York, NY",
        backgroundImage: "https://example.com/startup-pitch-bg.jpg",
        isTrending: false,
    },
];

let EventService: jest.Mock;
EventService = jest.fn()

test('Given: events - when: you want to see an overview of events - then the events are rendered', async () => {
    //When
    render(<EventOverview events={events}/>)

    getExpectedRequestStore(screen.getByText('Tech Conference 2024.'))
})