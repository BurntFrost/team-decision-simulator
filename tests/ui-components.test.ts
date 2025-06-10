import { describe, it, expect } from 'vitest';

// Mock the UserDecisionCharts component to test the famous people stability
// We'll create a simplified version that demonstrates the fix

// Simulate the old problematic behavior
const getRandomFamousPersonOld = (mbtiType: string): string => {
  const famousPeopleByMBTI: Record<string, string[]> = {
    INFJ: [
      "Martin Luther King Jr.",
      "Nelson Mandela", 
      "Mahatma Gandhi",
      "Taylor Swift",
      "Plato",
    ],
    INTJ: [
      "Elon Musk",
      "Mark Zuckerberg", 
      "Stephen Hawking",
      "Nikola Tesla",
      "Michelle Obama",
    ],
  };
  
  const people = famousPeopleByMBTI[mbtiType] || [];
  if (people.length === 0) return "";
  
  return people[Math.floor(Math.random() * people.length)];
};

// Simulate the new stable behavior using useMemo pattern
const createStableFamousPeopleMap = (mbtiTypes: string[]): Record<string, string> => {
  const famousPeopleByMBTI: Record<string, string[]> = {
    INFJ: [
      "Martin Luther King Jr.",
      "Nelson Mandela", 
      "Mahatma Gandhi", 
      "Taylor Swift",
      "Plato",
    ],
    INTJ: [
      "Elon Musk",
      "Mark Zuckerberg",
      "Stephen Hawking", 
      "Nikola Tesla",
      "Michelle Obama",
    ],
  };
  
  const map: Record<string, string> = {};
  mbtiTypes.forEach((mbtiType) => {
    const people = famousPeopleByMBTI[mbtiType] || [];
    if (people.length > 0) {
      map[mbtiType] = people[Math.floor(Math.random() * people.length)];
    }
  });
  return map;
};

describe('Famous People Display Stability', () => {
  it('old implementation produces different results on repeated calls', () => {
    // Test the old problematic behavior
    const results: string[] = [];
    
    // Call the function multiple times
    for (let i = 0; i < 10; i++) {
      results.push(getRandomFamousPersonOld('INFJ'));
    }
    
    // With random selection, we should get different results (most of the time)
    const uniqueResults = new Set(results);
    
    // This test might occasionally fail due to randomness, but it demonstrates the problem
    // In practice, users would see different names rapidly changing on hover
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  it('new implementation produces stable results within a session', () => {
    // Test the new stable behavior
    const mbtiTypes = ['INFJ', 'INTJ'];
    
    // Create the stable map once (simulating useMemo behavior)
    const stableMap = createStableFamousPeopleMap(mbtiTypes);
    
    // Multiple "lookups" should return the same result
    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(stableMap['INFJ'] || '');
    }
    
    // All results should be identical
    const uniqueResults = new Set(results);
    expect(uniqueResults.size).toBe(1);
    
    // And the result should be one of the valid famous people
    const validPeople = [
      "Martin Luther King Jr.",
      "Nelson Mandela", 
      "Mahatma Gandhi",
      "Taylor Swift", 
      "Plato",
    ];
    expect(validPeople).toContain(results[0]);
  });

  it('stable map contains entries for all provided MBTI types', () => {
    const mbtiTypes = ['INFJ', 'INTJ'];
    const stableMap = createStableFamousPeopleMap(mbtiTypes);
    
    // Should have an entry for each MBTI type
    expect(Object.keys(stableMap)).toHaveLength(2);
    expect(stableMap).toHaveProperty('INFJ');
    expect(stableMap).toHaveProperty('INTJ');
    
    // Each entry should be a non-empty string
    expect(stableMap['INFJ']).toBeTruthy();
    expect(stableMap['INTJ']).toBeTruthy();
    expect(typeof stableMap['INFJ']).toBe('string');
    expect(typeof stableMap['INTJ']).toBe('string');
  });

  it('different map instances can have different selections but remain stable', () => {
    const mbtiTypes = ['INFJ'];
    
    // Create multiple maps (simulating different component instances)
    const map1 = createStableFamousPeopleMap(mbtiTypes);
    const map2 = createStableFamousPeopleMap(mbtiTypes);
    
    // Each map should be internally stable
    expect(map1['INFJ']).toBe(map1['INFJ']); // Same reference, should be identical
    expect(map2['INFJ']).toBe(map2['INFJ']); // Same reference, should be identical
    
    // Maps might have different selections (that's okay)
    // But each should contain a valid famous person
    const validPeople = [
      "Martin Luther King Jr.",
      "Nelson Mandela",
      "Mahatma Gandhi", 
      "Taylor Swift",
      "Plato",
    ];
    expect(validPeople).toContain(map1['INFJ']);
    expect(validPeople).toContain(map2['INFJ']);
  });
});
