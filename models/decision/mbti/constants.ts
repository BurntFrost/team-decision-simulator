import { MBTIFactory } from "./index";

// MBTI Archetypes with their decision weights
export const archetypes = MBTIFactory.getArchetypeProfiles();

// Famous people examples for each MBTI type - Updated with diverse, current examples
export const famousPeopleByMBTI: Record<string, string[]> = {
  INTJ: [
    "Elon Musk",
    "Mark Zuckerberg",
    "Stephen Hawking",
    "Nikola Tesla",
    "Michelle Obama",
    "Satya Nadella",
  ],
  ENTJ: [
    "Steve Jobs",
    "Oprah Winfrey",
    "Sheryl Sandberg",
    "Gordon Ramsay",
    "Franklin D. Roosevelt",
    "Indra Nooyi",
  ],
  INTP: [
    "Albert Einstein",
    "Larry Page",
    "Bill Gates",
    "Isaac Newton",
    "Marie Curie",
    "Tina Fey",
  ],
  ENTP: [
    "Leonardo da Vinci",
    "Richard Feynman",
    "Barack Obama",
    "Thomas Edison",
    "Sarah Silverman",
    "Mark Cuban",
  ],
  INFJ: [
    "Martin Luther King Jr.",
    "Nelson Mandela",
    "Mahatma Gandhi",
    "Taylor Swift",
    "Plato",
    "Malala Yousafzai",
  ],
  ENFJ: [
    "Barack Obama",
    "Jennifer Lawrence",
    "Maya Angelou",
    "Neil deGrasse Tyson",
    "John Krasinski",
    "Kamala Harris",
  ],
  INFP: [
    "J.R.R. Tolkien",
    "William Shakespeare",
    "Johnny Depp",
    "Princess Diana",
    "Bob Dylan",
    "Tim Burton",
  ],
  ENFP: [
    "Robin Williams",
    "Walt Disney",
    "Robert Downey Jr.",
    "Ellen DeGeneres",
    "Mark Twain",
    "Will Smith",
  ],
  ISTJ: [
    "Jeff Bezos",
    "Queen Elizabeth II",
    "Warren Buffett",
    "George Washington",
    "Hermione Granger",
  ],
  ESTJ: [
    "Henry Ford",
    "Sheryl Sandberg",
    "Martha Stewart",
    "John D. Rockefeller",
    "Sonia Sotomayor",
  ],
  ISFJ: [
    "Mother Teresa",
    "Kate Middleton",
    "Beyoncé",
    "Rosa Parks",
    "Dr. Fauci",
  ],
  ESFJ: [
    "Taylor Swift",
    "Jennifer Garner",
    "Bill Clinton",
    "Hugh Jackman",
    "Steve Harvey",
  ],
  ISTP: [
    "Michael Jordan",
    "Tom Cruise",
    "Clint Eastwood",
    "Amelia Earhart",
    "Erwin Rommel",
  ],
  ESTP: [
    "Donald Trump",
    "Ernest Hemingway",
    "Madonna",
    "Eddie Murphy",
    "Winston Churchill",
  ],
  ISFP: [
    "Michael Jackson",
    "Frida Kahlo",
    "Keanu Reeves",
    "David Bowie",
    "Marilyn Monroe",
  ],
  ESFP: [
    "Adele",
    'Dwayne "The Rock" Johnson',
    "Jamie Foxx",
    "Miley Cyrus",
    "Elvis Presley",
  ],
};

// MBTI type descriptions with scientific factors
export const mbtiDescriptions = MBTIFactory.getDescriptions();
