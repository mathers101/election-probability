import type { State } from "./static-state-data";

export type SenateRace = {
  incumbent: "R" | "D" | "I" | null;
  incumbentName?: string;
  formerIncumbentName?: string;
  democraticCandidate: string;
  republicanCandidate: string;
  republicanProbability: number;
};

// 270toWin's consensus map uses qualitative ratings, so defaults translate
// those ratings consistently: safe 95%, likely 85%, leans 75%, toss-up 50%.
// Candidate order follows the names shown for each race on its 2026 map.
export const senate2026Races: Partial<Record<State, SenateRace>> = {
  AK: { incumbent: "R", incumbentName: "Dan Sullivan", democraticCandidate: "Mary Peltola", republicanCandidate: "Dan Sullivan", republicanProbability: 0.5 },
  AL: { incumbent: "R", incumbentName: "Tommy Tuberville", democraticCandidate: "Everett Wess", republicanCandidate: "Barry Moore", republicanProbability: 0.95 },
  AR: { incumbent: "R", incumbentName: "Tom Cotton", democraticCandidate: "Hallie Shoffner", republicanCandidate: "Tom Cotton", republicanProbability: 0.95 },
  CO: { incumbent: "D", incumbentName: "John Hickenlooper", democraticCandidate: "John Hickenlooper", republicanCandidate: "Mark Baisley", republicanProbability: 0.05 },
  DE: { incumbent: "D", incumbentName: "Chris Coons", democraticCandidate: "Chris Coons", republicanCandidate: "Michael Katz", republicanProbability: 0.05 },
  FL: { incumbent: "R", incumbentName: "Ashley Moody", democraticCandidate: "Angie Nixon", republicanCandidate: "Ashley Moody", republicanProbability: 0.85 },
  GA: { incumbent: "D", incumbentName: "Jon Ossoff", democraticCandidate: "Jon Ossoff", republicanCandidate: "Mike Collins", republicanProbability: 0.05 },
  ID: { incumbent: "R", incumbentName: "Jim Risch", democraticCandidate: "Todd Achilles", republicanCandidate: "Jim Risch", republicanProbability: 0.95 },
  IL: { incumbent: "D", incumbentName: "Dick Durbin", democraticCandidate: "Juliana Stratton", republicanCandidate: "Don Tracy", republicanProbability: 0.05 },
  IA: { incumbent: "R", incumbentName: "Joni Ernst", democraticCandidate: "Josh Turek", republicanCandidate: "Ashley Hinson", republicanProbability: 0.6 },
  KS: { incumbent: "R", incumbentName: "Roger Marshall", democraticCandidate: "Adam Hamilton", republicanCandidate: "Roger Marshall", republicanProbability: 0.7 },
  KY: { incumbent: "R", incumbentName: "Mitch McConnell", democraticCandidate: "Charles Booker", republicanCandidate: "Andy Barr", republicanProbability: 0.95 },
  LA: { incumbent: "R", incumbentName: "Bill Cassidy", democraticCandidate: "Jamie Davis", republicanCandidate: "Julia Letlow", republicanProbability: 0.95 },
  ME: { incumbent: "R", incumbentName: "Susan Collins", democraticCandidate: "Troy Jackson", republicanCandidate: "Susan Collins", republicanProbability: 0.4 },
  MA: { incumbent: "D", incumbentName: "Ed Markey", democraticCandidate: "Ed Markey", republicanCandidate: "John Deaton", republicanProbability: 0.05 },
  MI: { incumbent: "D", incumbentName: "Gary Peters", democraticCandidate: "Abdul El-Sayed", republicanCandidate: "Mike Rogers", republicanProbability: 0.4 },
  MN: { incumbent: "D", incumbentName: "Tina Smith", democraticCandidate: "Peggy Flanagan", republicanCandidate: "Michele Tafoya", republicanProbability: 0.1 },
  MS: { incumbent: "R", incumbentName: "Cindy Hyde-Smith", democraticCandidate: "Scott Colom", republicanCandidate: "Cindy Hyde-Smith", republicanProbability: 0.95 },
  MT: { incumbent: "R", incumbentName: "Steve Daines", democraticCandidate: "Alani Bankhead", republicanCandidate: "Kurt Alme", republicanProbability: 0.95 },
  NC: { incumbent: "R", incumbentName: "Thom Tillis", democraticCandidate: "Roy Cooper", republicanCandidate: "Michael Whatley", republicanProbability: 0.1 },
  NE: { incumbent: "R", incumbentName: "Pete Ricketts", democraticCandidate: "Dan Osborn", republicanCandidate: "Pete Ricketts", republicanProbability: 0.7 },
  NH: { incumbent: "D", incumbentName: "Jeanne Shaheen", democraticCandidate: "Chris Pappas", republicanCandidate: "John Sununu", republicanProbability: 0.15 },
  NJ: { incumbent: "D", incumbentName: "Cory Booker", democraticCandidate: "Cory Booker", republicanCandidate: "Justin Murphy", republicanProbability: 0.05 },
  NM: { incumbent: "D", incumbentName: "Ben Ray Lujan", democraticCandidate: "Ben Ray Lujan", republicanCandidate: "Larry Marker", republicanProbability: 0.05 },
  OH: { incumbent: "R", incumbentName: "Jon Husted", democraticCandidate: "Sherrod Brown", republicanCandidate: "Jon Husted", republicanProbability: 0.4 },
  OK: { incumbent: "R", incumbentName: "Alan Armstrong", democraticCandidate: "N'Kiyla Thomas", republicanCandidate: "Kevin Hern", republicanProbability: 0.95 },
  OR: { incumbent: "D", incumbentName: "Jeff Merkley", democraticCandidate: "Jeff Merkley", republicanCandidate: "David Smith", republicanProbability: 0.05 },
  RI: { incumbent: "D", incumbentName: "Jack Reed", democraticCandidate: "Jack Reed", republicanCandidate: "Raymond McKay", republicanProbability: 0.05 },
  SC: { incumbent: "R", incumbentName: "Darline Graham", democraticCandidate: "Annie Andrews", republicanCandidate: "Darline Graham", republicanProbability: 0.75 },
  SD: { incumbent: "R", incumbentName: "Mike Rounds", democraticCandidate: "Brian Bengs", republicanCandidate: "Mike Rounds", republicanProbability: 0.95 },
  TN: { incumbent: "R", incumbentName: "Bill Hagerty", democraticCandidate: "Marquita Bradshaw", republicanCandidate: "Bill Hagerty", republicanProbability: 0.95 },
  TX: { incumbent: "R", incumbentName: "John Cornyn", democraticCandidate: "James Talarico", republicanCandidate: "Ken Paxton", republicanProbability: 0.5 },
  VA: { incumbent: "D", incumbentName: "Mark Warner", democraticCandidate: "Mark Warner", republicanCandidate: "Bert Mizusawa", republicanProbability: 0.05 },
  WV: { incumbent: "R", incumbentName: "Shelley Moore Capito", democraticCandidate: "Rachel Fetty Anderson", republicanCandidate: "Shelley Moore Capito", republicanProbability: 0.95 },
  WY: { incumbent: "R", incumbentName: "Cynthia Lummis", democraticCandidate: "James Byrd", republicanCandidate: "Harriet Hageman", republicanProbability: 0.95 },
};

export const senate2026Incumbents = Object.fromEntries(
  Object.entries(senate2026Races).map(([state, race]) => [state, race.incumbent]),
) as Partial<Record<State, "R" | "D" | "I" | null>>;

export const initialSenateProbabilities = Object.fromEntries(
  Object.entries(senate2026Races).map(([state, race]) => [state, { R: race.republicanProbability, D: 1 - race.republicanProbability }]),
) as Partial<Record<State, { R: number; D: number }>>;
