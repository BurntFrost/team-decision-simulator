import { SimulationResult } from "@/models/decision/types";

// ─── MBTI Colors & Short Descriptions ─────────────────────────────────────────

export const MBTI_COLORS: Record<string, string> = {
  INTJ: "#2563eb", ENTJ: "#7c3aed", INTP: "#059669", ENTP: "#ea580c",
  INFJ: "#be185d", ENFJ: "#0891b2", INFP: "#4338ca", ENFP: "#b91c1c",
  ISTJ: "#1e40af", ESTJ: "#166534", ISFJ: "#86198f", ESFJ: "#9f1239",
  ISTP: "#854d0e", ESTP: "#b45309", ISFP: "#0f766e", ESFP: "#6b21a8",
};

export const MBTI_SHORT_DESCRIPTIONS: Record<string, string> = {
  INTJ: "Strategic, innovative thinkers who value logic and systematic planning",
  ENTJ: "Natural leaders who excel at strategic planning and execution",
  INTP: "Logical, creative problem solvers with a thirst for knowledge",
  ENTP: "Quick-thinking innovators who love intellectual challenges",
  INFJ: "Insightful idealists driven by deep personal values",
  ENFJ: "Charismatic leaders focused on personal growth and development",
  INFP: "Creative idealists guided by their core values and beliefs",
  ENFP: "Enthusiastic creatives who love exploring possibilities",
  ISTJ: "Practical, fact-minded individuals who value reliability",
  ESTJ: "Efficient organizers who excel at implementing practical solutions",
  ISFJ: "Dedicated caretakers who value tradition and security",
  ESFJ: "Caring, social individuals who value harmony and cooperation",
  ISTP: "Versatile problem-solvers with a practical approach",
  ESTP: "Action-oriented realists who thrive on spontaneity",
  ISFP: "Gentle creatives who live in the moment",
  ESFP: "Enthusiastic performers who love life and spontaneity",
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export const getMBTIColor = (mbtiType: string): string =>
  MBTI_COLORS[mbtiType] ?? "#64748b";

export const getMBTIDescription = (mbtiType: string): string =>
  MBTI_SHORT_DESCRIPTIONS[mbtiType] ?? "Description not available";

export const getRandomFamousPerson = (mbtiType: string): string => {
  const people = famousPeopleByMBTI[mbtiType] ?? [];
  return people.length > 0
    ? people[Math.floor(Math.random() * people.length)]
    : "";
};

export const getHarryPotterHouse = (mbtiType: string): string =>
  harryPotterHousesByMBTI[mbtiType]?.house ?? "Unknown";

export const getHouseColor = (mbtiType: string): string =>
  harryPotterHousesByMBTI[mbtiType]?.color ?? "#666666";

// ─── Famous People ────────────────────────────────────────────────────────────

export const famousPeopleByMBTI: Record<string, string[]> = {
  INTJ: ["Elon Musk", "Mark Zuckerberg", "Stephen Hawking", "Nikola Tesla", "Michelle Obama", "Satya Nadella"],
  ENTJ: ["Steve Jobs", "Oprah Winfrey", "Sheryl Sandberg", "Gordon Ramsay", "Franklin D. Roosevelt", "Indra Nooyi"],
  INTP: ["Albert Einstein", "Larry Page", "Bill Gates", "Isaac Newton", "Marie Curie", "Tina Fey"],
  ENTP: ["Leonardo da Vinci", "Richard Feynman", "Barack Obama", "Thomas Edison", "Sarah Silverman", "Mark Cuban"],
  INFJ: ["Martin Luther King Jr.", "Nelson Mandela", "Mahatma Gandhi", "Taylor Swift", "Plato", "Malala Yousafzai"],
  ENFJ: ["Barack Obama", "Jennifer Lawrence", "Maya Angelou", "Neil deGrasse Tyson", "John Krasinski", "Kamala Harris"],
  INFP: ["J.R.R. Tolkien", "William Shakespeare", "Johnny Depp", "Princess Diana", "Bob Dylan", "Tim Burton"],
  ENFP: ["Robin Williams", "Walt Disney", "Robert Downey Jr.", "Ellen DeGeneres", "Mark Twain", "Will Smith"],
  ISTJ: ["Jeff Bezos", "Queen Elizabeth II", "Warren Buffett", "George Washington", "Hermione Granger"],
  ESTJ: ["Henry Ford", "Sheryl Sandberg", "Martha Stewart", "John D. Rockefeller", "Sonia Sotomayor"],
  ISFJ: ["Mother Teresa", "Kate Middleton", "Beyoncé", "Rosa Parks", "Dr. Fauci"],
  ESFJ: ["Taylor Swift", "Jennifer Garner", "Bill Clinton", "Hugh Jackman", "Steve Harvey"],
  ISTP: ["Michael Jordan", "Tom Cruise", "Clint Eastwood", "Amelia Earhart", "Erwin Rommel"],
  ESTP: ["Donald Trump", "Ernest Hemingway", "Madonna", "Eddie Murphy", "Winston Churchill"],
  ISFP: ["Michael Jackson", "Frida Kahlo", "Keanu Reeves", "David Bowie", "Marilyn Monroe"],
  ESFP: ["Adele", "Dwayne \"The Rock\" Johnson", "Jamie Foxx", "Miley Cyrus", "Elvis Presley"],
};

// ─── The Office Characters ────────────────────────────────────────────────────

export const officeCharactersByMBTI: Record<string, string[]> = {
  INTJ: ["Oscar Martinez"], ENTJ: ["Jan Levinson"], INTP: ["Gabe Lewis"], ENTP: ["Jim Halpert"],
  INFJ: ["Toby Flenderson"], ENFJ: ["Andy Bernard"], INFP: ["Erin Hannon"], ENFP: ["Michael Scott"],
  ISTJ: ["Dwight Schrute"], ESTJ: ["Angela Martin"], ISFJ: ["Pam Beesly"], ESFJ: ["Phyllis Vance"],
  ISTP: ["Stanley Hudson"], ESTP: ["Todd Packer"], ISFP: ["Holly Flax"], ESFP: ["Kelly Kapoor"],
};

// ─── Harry Potter Characters ──────────────────────────────────────────────────

export const harryPotterCharactersByMBTI: Record<string, string[]> = {
  INTJ: ["Severus Snape", "Tom Riddle"], ENTJ: ["Hermione Granger", "McGonagall"],
  INTP: ["Luna Lovegood", "Newt Scamander"], ENTP: ["Fred Weasley", "George Weasley"],
  INFJ: ["Dumbledore", "Remus Lupin"], ENFJ: ["Harry Potter", "Molly Weasley"],
  INFP: ["Dobby", "Neville Longbottom"], ENFP: ["Ron Weasley", "Tonks"],
  ISTJ: ["Percy Weasley", "Barty Crouch Sr."], ESTJ: ["Dolores Umbridge", "Vernon Dursley"],
  ISFJ: ["Hagrid", "Mrs. Weasley"], ESFJ: ["Cedric Diggory", "Fleur Delacour"],
  ISTP: ["Sirius Black", "Mad-Eye Moody"], ESTP: ["Draco Malfoy", "Gilderoy Lockhart"],
  ISFP: ["Cho Chang", "Lavender Brown"], ESFP: ["Peeves", "Rita Skeeter"],
};

// ─── Character Pools (by franchise) ──────────────────────────────────────────

export const franchiseCategories = ["The Office", "Harry Potter", "Marvel", "DC"];

export const characterPoolsByMBTI: Record<string, Record<string, string[]>> = {
  INTJ: {
    "The Office": ["Oscar Martinez", "Toby Flenderson"],
    "Harry Potter": ["Severus Snape", "Professor McGonagall", "Hermione Granger"],
    Marvel: ["Doctor Strange", "Vision", "Tony Stark", "Doctor Doom", "Thanos", "Ultron"],
    DC: ["Batman", "Martian Manhunter", "Cyborg", "Lex Luthor", "Brainiac", "The Riddler"],
  },
  ENTJ: {
    "The Office": ["Jan Levinson", "Charles Miner"],
    "Harry Potter": ["Hermione Granger", "Dolores Umbridge", "Voldemort"],
    Marvel: ["Nick Fury", "Captain America", "Carol Danvers", "Magneto", "Kingpin", "Norman Osborn"],
    DC: ["Wonder Woman", "Amanda Waller", "Ra's al Ghul", "Darkseid", "General Zod", "Lex Luthor"],
  },
  INTP: {
    "The Office": ["Gabe Lewis", "Ryan Howard"],
    "Harry Potter": ["Luna Lovegood", "Xenophilius Lovegood", "Ollivander"],
    Marvel: ["Tony Stark", "Bruce Banner", "Reed Richards", "Green Goblin", "Ultron", "Doctor Octopus"],
    DC: ["Mr. Terrific", "Cyborg", "The Atom", "The Riddler", "Scarecrow", "Calculator"],
  },
  ENTP: {
    "The Office": ["Jim Halpert", "Todd Packer"],
    "Harry Potter": ["Fred Weasley", "George Weasley", "Gilderoy Lockhart"],
    Marvel: ["Spider-Man", "Deadpool", "Star-Lord", "Loki", "Mysterio", "Green Goblin"],
    DC: ["The Flash", "Green Lantern", "Booster Gold", "The Joker", "Trickster", "Captain Cold"],
  },
  INFJ: {
    "The Office": ["Toby Flenderson", "Karen Filippelli"],
    "Harry Potter": ["Dumbledore", "Remus Lupin", "Newt Scamander"],
    Marvel: ["Professor X", "Daredevil", "Vision", "Mystique", "Silver Surfer", "Magneto"],
    DC: ["Superman", "Raven", "Martian Manhunter", "Two-Face", "Poison Ivy", "Mr. Freeze"],
  },
  ENFJ: {
    "The Office": ["Andy Bernard", "Holly Flax"],
    "Harry Potter": ["Harry Potter", "Molly Weasley", "Minerva McGonagall"],
    Marvel: ["Captain Marvel", "Storm", "Captain America", "Emma Frost", "Venom", "Loki"],
    DC: ["Aquaman", "Starfire", "Wonder Woman", "Catwoman", "Black Manta", "Talia al Ghul"],
  },
  INFP: {
    "The Office": ["Erin Hannon", "Pam Beesly"],
    "Harry Potter": ["Dobby", "Luna Lovegood", "Neville Longbottom"],
    Marvel: ["Wanda Maximoff", "Peter Parker", "Groot", "Bucky Barnes", "Gambit", "Rogue"],
    DC: ["Beast Boy", "Shazam", "Zatanna", "Harley Quinn", "Mr. Freeze", "Clayface"],
  },
  ENFP: {
    "The Office": ["Michael Scott", "Kelly Kapoor"],
    "Harry Potter": ["Ron Weasley", "Tonks", "Hagrid"],
    Marvel: ["Star-Lord", "Ant-Man", "Human Torch", "Rocket Raccoon", "Carnage", "Deadpool"],
    DC: ["Booster Gold", "Plastic Man", "The Flash", "Captain Cold", "Clayface", "Trickster"],
  },
  ISTJ: {
    "The Office": ["Dwight Schrute", "Oscar Martinez"],
    "Harry Potter": ["Percy Weasley", "Barty Crouch Sr.", "Kingsley Shacklebolt"],
    Marvel: ["Captain America", "Hawkeye", "Falcon", "Red Skull", "Taskmaster", "Winter Soldier"],
    DC: ["Commissioner Gordon", "Green Arrow", "Alfred Pennyworth", "Deathstroke", "Penguin", "Two-Face"],
  },
  ESTJ: {
    "The Office": ["Angela Martin", "Jan Levinson"],
    "Harry Potter": ["Dolores Umbridge", "Vernon Dursley", "Cornelius Fudge"],
    Marvel: ["J. Jonah Jameson", "Maria Hill", "Nick Fury", "Norman Osborn", "Baron Zemo", "Kingpin"],
    DC: ["Amanda Waller", "Alfred Pennyworth", "General Zod", "Lex Luthor", "Commissioner Gordon"],
  },
  ISFJ: {
    "The Office": ["Pam Beesly", "Phyllis Vance"],
    "Harry Potter": ["Hagrid", "Mrs. Weasley", "Neville Longbottom"],
    Marvel: ["Aunt May", "Pepper Potts", "Captain America", "Sandman", "Lizard", "Rhino"],
    DC: ["Martha Kent", "Lois Lane", "Alfred Pennyworth", "Killer Croc", "Calendar Man", "Clayface"],
  },
  ESFJ: {
    "The Office": ["Phyllis Vance", "Meredith Palmer"],
    "Harry Potter": ["Cedric Diggory", "Cho Chang", "Fleur Delacour"],
    Marvel: ["Spider-Man", "Falcon", "Captain Marvel", "Electro", "Rhino", "Shocker"],
    DC: ["Supergirl", "Batgirl", "Wonder Woman", "Cheetah", "Mirror Master", "Livewire"],
  },
  ISTP: {
    "The Office": ["Stanley Hudson", "Creed Bratton"],
    "Harry Potter": ["Sirius Black", "Mad-Eye Moody", "Kingsley Shacklebolt"],
    Marvel: ["Wolverine", "Punisher", "Black Widow", "Winter Soldier", "Bullseye", "Crossbones"],
    DC: ["Batman", "Red Hood", "Green Arrow", "Deadshot", "Bane", "Deathstroke"],
  },
  ESTP: {
    "The Office": ["Todd Packer", "Roy Anderson"],
    "Harry Potter": ["Draco Malfoy", "James Potter", "Sirius Black"],
    Marvel: ["Thor", "Gambit", "Iron Man", "Sabretooth", "Juggernaut", "Venom"],
    DC: ["Guy Gardner", "Lobo", "Hal Jordan", "Captain Boomerang", "Gorilla Grodd", "Parasite"],
  },
  ISFP: {
    "The Office": ["Holly Flax", "Erin Hannon"],
    "Harry Potter": ["Cho Chang", "Lavender Brown", "Colin Creevey"],
    Marvel: ["Groot", "Mantis", "Wanda Maximoff", "Rogue", "Quicksilver", "Gambit"],
    DC: ["Nightwing", "Zatanna", "Beast Boy", "Scarecrow", "Mad Hatter", "Poison Ivy"],
  },
  ESFP: {
    "The Office": ["Kelly Kapoor", "Meredith Palmer"],
    "Harry Potter": ["Rita Skeeter", "Gilderoy Lockhart", "Peeves"],
    Marvel: ["Deadpool", "Human Torch", "Spider-Man", "Shocker", "Toad", "Carnage"],
    DC: ["The Flash", "Impulse", "Plastic Man", "Trickster", "Captain Cold", "Mirror Master"],
  },
};

// ─── Hogwarts Houses ──────────────────────────────────────────────────────────

export const harryPotterHousesByMBTI: Record<string, { house: string; color: string; traits: string[] }> = {
  // Gryffindor
  ENFJ: { house: "Gryffindor", color: "#740001", traits: ["bravery", "courage", "determination", "leadership"] },
  ENTJ: { house: "Gryffindor", color: "#740001", traits: ["bravery", "leadership", "boldness", "confidence"] },
  ESFP: { house: "Gryffindor", color: "#740001", traits: ["courage", "adventurous", "enthusiastic", "spontaneous"] },
  ESTP: { house: "Gryffindor", color: "#740001", traits: ["boldness", "risk-taking", "action-oriented", "adaptable"] },
  // Hufflepuff
  ISFJ: { house: "Hufflepuff", color: "#FFD800", traits: ["loyalty", "patience", "fairness", "hard-working"] },
  ESFJ: { house: "Hufflepuff", color: "#FFD800", traits: ["loyalty", "supportive", "caring", "inclusive"] },
  ISFP: { house: "Hufflepuff", color: "#FFD800", traits: ["patience", "kindness", "harmony", "authenticity"] },
  ENFP: { house: "Hufflepuff", color: "#FFD800", traits: ["enthusiasm", "inclusivity", "optimism", "empathy"] },
  // Ravenclaw
  INTJ: { house: "Ravenclaw", color: "#0E1A40", traits: ["intelligence", "strategy", "independence", "vision"] },
  INTP: { house: "Ravenclaw", color: "#0E1A40", traits: ["wisdom", "analysis", "creativity", "logic"] },
  INFJ: { house: "Ravenclaw", color: "#0E1A40", traits: ["insight", "intuition", "wisdom", "idealism"] },
  INFP: { house: "Ravenclaw", color: "#0E1A40", traits: ["creativity", "individuality", "depth", "authenticity"] },
  // Slytherin
  ESTJ: { house: "Slytherin", color: "#1A472A", traits: ["ambition", "leadership", "efficiency", "determination"] },
  ISTJ: { house: "Slytherin", color: "#1A472A", traits: ["resourcefulness", "persistence", "strategy", "reliability"] },
  ENTP: { house: "Slytherin", color: "#1A472A", traits: ["cunning", "adaptability", "innovation", "persuasion"] },
  ISTP: { house: "Slytherin", color: "#1A472A", traits: ["resourcefulness", "pragmatism", "independence", "efficiency"] },
};

export const hogwartsHouseInfo: Record<string, { characters: string[]; quote: string }> = {
  Gryffindor: {
    characters: ["Harry Potter", "Hermione Granger", "Ron Weasley"],
    quote: "Daring, nerve, and chivalry set Gryffindors apart.",
  },
  Hufflepuff: {
    characters: ["Cedric Diggory", "Nymphadora Tonks", "Pomona Sprout"],
    quote: "Those patient Hufflepuffs are true and unafraid of toil.",
  },
  Ravenclaw: {
    characters: ["Luna Lovegood", "Cho Chang", "Garrick Ollivander"],
    quote: "Wit beyond measure is man's greatest treasure.",
  },
  Slytherin: {
    characters: ["Severus Snape", "Draco Malfoy", "Tom Riddle"],
    quote: "Those cunning folk use any means to achieve their ends.",
  },
};

// ─── Office Departments ───────────────────────────────────────────────────────

export const officeDepartmentsByMBTI: Record<string, { department: string; color: string; role: string; traits: string[] }> = {
  ENFP: { department: "Management", color: "#1e40af", role: "Regional Manager", traits: ["charismatic", "enthusiastic", "people-focused", "creative"] },
  ENTJ: { department: "Management", color: "#1e40af", role: "Corporate Executive", traits: ["strategic", "decisive", "results-oriented", "authoritative"] },
  ENFJ: { department: "Management", color: "#1e40af", role: "Regional Director", traits: ["inspiring", "collaborative", "goal-oriented", "diplomatic"] },
  ENTP: { department: "Sales", color: "#059669", role: "Sales Representative", traits: ["persuasive", "adaptable", "relationship-building", "innovative"] },
  ESTP: { department: "Sales", color: "#059669", role: "Traveling Salesman", traits: ["aggressive", "competitive", "action-oriented", "opportunistic"] },
  ISTJ: { department: "Sales", color: "#059669", role: "Top Salesman", traits: ["persistent", "methodical", "reliable", "detail-focused"] },
  INTJ: { department: "Accounting", color: "#7c2d12", role: "Senior Accountant", traits: ["analytical", "precise", "logical", "independent"] },
  ESTJ: { department: "Accounting", color: "#7c2d12", role: "Head of Accounting", traits: ["organized", "efficient", "rule-following", "authoritative"] },
  ISTP: { department: "Accounting", color: "#7c2d12", role: "Financial Analyst", traits: ["practical", "logical", "independent", "problem-solving"] },
  ISFJ: { department: "Reception", color: "#be185d", role: "Receptionist", traits: ["supportive", "organized", "helpful", "detail-oriented"] },
  INFP: { department: "Reception", color: "#be185d", role: "Reception Assistant", traits: ["caring", "adaptable", "creative", "people-focused"] },
  ESFJ: { department: "Reception", color: "#be185d", role: "Office Coordinator", traits: ["social", "organized", "supportive", "team-oriented"] },
  INFJ: { department: "HR", color: "#7c3aed", role: "HR Representative", traits: ["empathetic", "principled", "conflict-resolution", "systematic"] },
  ISFP: { department: "HR", color: "#7c3aed", role: "HR Liaison", traits: ["compassionate", "flexible", "people-focused", "harmonious"] },
  ESFP: { department: "Customer Service", color: "#ea580c", role: "Customer Service Rep", traits: ["energetic", "people-oriented", "spontaneous", "enthusiastic"] },
  INTP: { department: "Corporate", color: "#6b7280", role: "Corporate Liaison", traits: ["analytical", "strategic", "independent", "innovative"] },
};

export const officeDepartmentInfo: Record<string, { description: string; motto: string; characteristics: string[] }> = {
  Management: {
    description: "Visionary leaders who drive company culture and strategic direction through inspiration and decisive action.",
    motto: "That's what she said... about leadership excellence!",
    characteristics: ["Strategic thinking", "Team motivation", "Decision authority", "Cultural influence"],
  },
  Sales: {
    description: "Results-driven professionals who build relationships and close deals through persistence and adaptability.",
    motto: "Bears. Beets. Battlestar Galactica. Sales.",
    characteristics: ["Revenue focus", "Client relationships", "Competitive drive", "Adaptability"],
  },
  Accounting: {
    description: "Detail-oriented analysts who ensure financial accuracy and compliance through systematic processes.",
    motto: "Actually, the numbers don't lie.",
    characteristics: ["Precision", "Compliance", "Analytical thinking", "Process adherence"],
  },
  Reception: {
    description: "Supportive coordinators who maintain office operations and provide excellent internal customer service.",
    motto: "Dunder Mifflin, this is Pam... I mean, how can we help?",
    characteristics: ["Organization", "Communication", "Support", "Coordination"],
  },
  HR: {
    description: "People-focused professionals who balance employee needs with company policies and conflict resolution.",
    motto: "I'm not superstitious, but I am a little stitious about HR policies.",
    characteristics: ["Employee relations", "Policy enforcement", "Conflict resolution", "Compliance"],
  },
  "Customer Service": {
    description: "Energetic representatives who maintain client satisfaction through enthusiasm and problem-solving.",
    motto: "OMG, like, customer satisfaction is totally our thing!",
    characteristics: ["Client satisfaction", "Problem solving", "Energy", "Responsiveness"],
  },
  Corporate: {
    description: "Strategic thinkers who analyze company operations and implement corporate initiatives.",
    motto: "Synergy and optimization through strategic corporate alignment.",
    characteristics: ["Strategic analysis", "Process improvement", "Corporate alignment", "Innovation"],
  },
};

// ─── Grouping Utility ─────────────────────────────────────────────────────────

export type HouseGroup = {
  name: string;
  color: string;
  count: number;
  types: string[];
  decisions: Record<string, number>;
  averageScore: number;
};

export const groupResultsByHogwartsHouses = (
  results: SimulationResult[]
): Record<string, HouseGroup> => {
  const houseGroups: Record<string, HouseGroup> = {
    Gryffindor: { name: "Gryffindor", color: "#740001", count: 0, types: [], decisions: {}, averageScore: 0 },
    Hufflepuff: { name: "Hufflepuff", color: "#FFD800", count: 0, types: [], decisions: {}, averageScore: 0 },
    Ravenclaw: { name: "Ravenclaw", color: "#0E1A40", count: 0, types: [], decisions: {}, averageScore: 0 },
    Slytherin: { name: "Slytherin", color: "#1A472A", count: 0, types: [], decisions: {}, averageScore: 0 },
  };

  const totalScores: Record<string, number> = {
    Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0,
  };

  results.forEach((result) => {
    const house = getHarryPotterHouse(result.name);
    if (houseGroups[house]) {
      houseGroups[house].count++;
      houseGroups[house].types.push(result.name);
      houseGroups[house].decisions[result.decision] =
        (houseGroups[house].decisions[result.decision] || 0) + 1;
      totalScores[house] += result.score;
    }
  });

  Object.keys(houseGroups).forEach((house) => {
    if (houseGroups[house].count > 0) {
      houseGroups[house].averageScore = totalScores[house] / houseGroups[house].count;
    }
  });

  return houseGroups;
};
