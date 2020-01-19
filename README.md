# UCL ChatBot

A Facebook Messenger interactive querier for the UCL API!

# Functionalities

## Room bookings

### Free room information

Q: rooms

A: When?

User select: Now | In an hour | In 2 hours

Backend: UCL API free rooms request

A: There are a few, probably closest for you is the following:

A (Using backend data): Front Lodges, North Lodge 001 with capacity 10.

A: Do you want to place a booking?

User select: Yes | No

A (Yes): Great! Booking placed

A (No): Okay, what else can I help?

## Search

### Get People

Q: people

A: Who do you want to search for?

Q: Jake

Backend: UCL API Search people request

A: I found a few people under that, take a look:

A: Jake Doe, student at Dept of Med Phys & Biomed, email jake.doe.17@ucl.ac.uk

A: ...

## Timetable

### Quick query


Q: where | when

Backend: UCL API Get Timetable By Modules request

A: According to your timetable, you currently don't have anything scheduled! Take a break until your next Computatoinal Complexity lecture at 09:00 - 10:00 at Anatomy G29 J Z 
Young LT. 

|

A: Hurry, you're late! You should be at your Computatoinal Complexity lecture at 09:00 - 10:00 at Anatomy G29 J Z Young LT.

Note: To avoid having to implement log-in, currently we can hardcode a list of modules for which we'll get timetables (the API supports this)

