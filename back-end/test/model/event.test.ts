import { Event } from '../../model/event';

// Sample data for the event
const name = 'Taylor Swift concert';
const description = 'Amazing music, sung by a talented artist.';
const date = new Date('2024-12-12');
const location = 'Amsterdam';
const category = 'Big-Event';



//Tests
test('Given: valid values for event, when: event is created, then: event is created with those values', () => {
    // Given
    const event = new Event({
        name,
        description,
        date,
        location,
        category,
        backgroundImage: "",
        users: [],
        isTrending: false
    });
    // When
    const createdEvent = event;

    // Then
    expect(createdEvent.getName()).toEqual(name);
    expect(createdEvent.getDescription()).toEqual(description);
    expect(createdEvent.getDate()).toEqual(date);
    expect(createdEvent.getLocation()).toEqual(location);
    expect(createdEvent.getCategory()).toEqual(category);
});

test('given: invalid date, when: event is created, then: an error is thrown', () => {
    // given
    const invalidEndDate = new Date('Invalid-date-string');

    // when
    const newEvent = () => {
        new Event({ name, description, date: invalidEndDate, location, category, backgroundImage: "", users: [], isTrending: false })
    };
    // then
    expect(newEvent).toThrow('Date is invalid');

});

test('Given: event with an id, when: getId is called, then: returns the event with the correct id.,', () => {
    //given:
    const id = 1;
    const event = new Event({
        id,
        name,
        description,
        date,
        location,
        category,
        backgroundImage: "",
        users: [],
        isTrending: false
    });

    //Then:
    expect(event.getId()).toEqual(id);
});

test('Given: event with no id, when: wanting to call event with getId, then: error is thrown.', () => {
    // Given
    const event = new Event({ name, description, date, location, category, backgroundImage: "", users: [], isTrending: false });

    // When
    const getId = () => event.getId();

    // Then
    expect(getId).toThrow('The event needs to have an ID.');
});

test('Given: event with empty name, When: event is created, Then: an error is thrown', () => {
    // Given
    const emptyName = '';

    // When
    const createEvent = () => {
        new Event({ name: emptyName, description, date, location, category, backgroundImage: "", users: [], isTrending: false });
    };

    // Then
    expect(createEvent).toThrow('Name cannot be empty');
});

test('Given: event with empty description, When: event is created, Then: an error is thrown', () => {
    // Given
    const emptyDescription = '';

    // When
    const createEvent = () => {
        new Event({ name, description: emptyDescription, date, location, category, backgroundImage: "", users: [], isTrending: false });
    };

    // Then
    expect(createEvent).toThrow('Description cannot be empty');
});

test('Given: event with empty location, When: event is created, Then: an error is thrown', () => {
    // Given
    const emptyLocation = '';

    // When
    const createEvent = () => {
        new Event({ name, description, date, location: emptyLocation, category, backgroundImage: "", users: [], isTrending: false });
    };

    // Then
    expect(createEvent).toThrow('Location cannot be empty');
});

test('Given: event with empty category, When: event is created, Then: an error is thrown', () => {
    // Given
    const emptyCategory = '';

    // When
    const createEvent = () => {
        new Event({ name, description, date, location, category: emptyCategory, backgroundImage: "", users: [], isTrending: false });
    };

    // Then
    expect(createEvent).toThrow('Category cannot be empty');
});


test('Given: event with no backgroundImage, When: an event is created, Then: backgroundImage returns an empty string.', () => {
    //Given
    const event = new Event({
        name,
        description,
        date,
        location,
        category,
        backgroundImage: "", // other possibility is that nothing is provided.
        users: [],
        isTrending: false
    });

    //When
    const createEvent = event;

    //Then
    expect(createEvent.getBackgroundImage()).toEqual(""); // here we are setting the default value when nothing is provided.
})


test('Given: when isTrending is not a boolean, When: Event is made, Then: an error is thrown', () => {
    //Given:
    const invalidIsTrending = "This is a string not a boolean.",

    //When:
    const createEvent = () => {
        new Event({
            name,
            description,
            date,
            location,
            category,
            backgroundImage: "",
            users: [],
            isTrending: invalidIsTrending as any, // Simulating invalid value
        });
    };

    //Then
    expect(createEvent).toThrow("IsTrending must be a boolean.")
})

//Temp: idea: shouldnt event when created not always have a user?
// test('Given: event with no users, When: event is created, Then: an error is thrown', () => {
//     // Given
//     const eventData = {
//         name,
//         description,
//         date,
//         location,
//         category,
//         backgroundImage: "",
//         users: [],  //no users => added validation in the events.ts
//         isTrending: false
//     };

//     // When
//     const createEvent = () => new Event(eventData);

//     // Then
//     expect(createEvent).toThrow('Event must have at least one user');
// });



