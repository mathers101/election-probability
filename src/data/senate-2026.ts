import type { State } from "./static-state-data";
import { partyColors, type CandidateParty } from "./state-probabilities";

export type SenateRace = {
  incumbent: "R" | "D" | "I" | null;
  incumbentName?: string;
  formerIncumbentName?: string;
  leftCandidate: string;
  leftCandidateParty: SenateParty;
  rightCandidate: string;
  rightCandidateParty: SenateParty;
  republicanProbability: number;
};
export type SenateParty = CandidateParty;
export const senatePartyColors = partyColors;

// 270toWin's consensus map uses qualitative ratings, so defaults translate
// those ratings consistently: safe uses safeRaceProbability, likely 85%,
// leans 75%, toss-up 50%. Candidate order follows the names shown for each
// race on its 2026 map. Safe Democratic races store the complement, since
// republicanProbability is the Republican win chance.
export const senate2026Races = (
  safeWinProbability: number,
): Partial<Record<State, SenateRace>> => {
  return {
  AK: { incumbent: "R", incumbentName: "Dan Sullivan", leftCandidate: "Mary Peltola", leftCandidateParty: "D", rightCandidate: "Dan Sullivan", rightCandidateParty: "R", republicanProbability: 0.5 },
  AL: { incumbent: "R", incumbentName: "Tommy Tuberville", leftCandidate: "Everett Wess", leftCandidateParty: "D", rightCandidate: "Barry Moore", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  AR: { incumbent: "R", incumbentName: "Tom Cotton", leftCandidate: "Hallie Shoffner", leftCandidateParty: "D", rightCandidate: "Tom Cotton", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  CO: { incumbent: "D", incumbentName: "John Hickenlooper", leftCandidate: "John Hickenlooper", leftCandidateParty: "D", rightCandidate: "Mark Baisley", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability},
  DE: { incumbent: "D", incumbentName: "Chris Coons", leftCandidate: "Chris Coons", leftCandidateParty: "D", rightCandidate: "Michael Katz", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  FL: { incumbent: "R", incumbentName: "Ashley Moody", leftCandidate: "Angie Nixon", leftCandidateParty: "D", rightCandidate: "Ashley Moody", rightCandidateParty: "R", republicanProbability: 0.85 },
  GA: { incumbent: "D", incumbentName: "Jon Ossoff", leftCandidate: "Jon Ossoff", leftCandidateParty: "D", rightCandidate: "Mike Collins", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  ID: { incumbent: "R", incumbentName: "Jim Risch", leftCandidate: "Todd Achilles", leftCandidateParty: "I", rightCandidate: "Jim Risch", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  IL: { incumbent: "D", incumbentName: "Dick Durbin", leftCandidate: "Juliana Stratton", leftCandidateParty: "D", rightCandidate: "Don Tracy", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  IA: { incumbent: "R", incumbentName: "Joni Ernst", leftCandidate: "Josh Turek", leftCandidateParty: "D", rightCandidate: "Ashley Hinson", rightCandidateParty: "R", republicanProbability: 0.6 },
  KS: { incumbent: "R", incumbentName: "Roger Marshall", leftCandidate: "Adam Hamilton", leftCandidateParty: "D", rightCandidate: "Roger Marshall", rightCandidateParty: "R", republicanProbability: 0.7 },
  KY: { incumbent: "R", incumbentName: "Mitch McConnell", leftCandidate: "Charles Booker", leftCandidateParty: "D", rightCandidate: "Andy Barr", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  LA: { incumbent: "R", incumbentName: "Bill Cassidy", leftCandidate: "Jamie Davis", leftCandidateParty: "D", rightCandidate: "Julia Letlow", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  ME: { incumbent: "R", incumbentName: "Susan Collins", leftCandidate: "Troy Jackson", leftCandidateParty: "D", rightCandidate: "Susan Collins", rightCandidateParty: "R", republicanProbability: 0.4 },
  MA: { incumbent: "D", incumbentName: "Ed Markey", leftCandidate: "Ed Markey", leftCandidateParty: "D", rightCandidate: "John Deaton", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  MI: { incumbent: "D", incumbentName: "Gary Peters", leftCandidate: "Abdul El-Sayed", leftCandidateParty: "D", rightCandidate: "Mike Rogers", rightCandidateParty: "R", republicanProbability: 0.4 },
  MN: { incumbent: "D", incumbentName: "Tina Smith", leftCandidate: "Peggy Flanagan", leftCandidateParty: "D", rightCandidate: "Michele Tafoya", rightCandidateParty: "R", republicanProbability: 0.1 },
  MS: { incumbent: "R", incumbentName: "Cindy Hyde-Smith", leftCandidate: "Scott Colom", leftCandidateParty: "D", rightCandidate: "Cindy Hyde-Smith", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  MT: { incumbent: "R", incumbentName: "Steve Daines", leftCandidate: "Alani Bankhead", leftCandidateParty: "D", rightCandidate: "Kurt Alme", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  NC: { incumbent: "R", incumbentName: "Thom Tillis", leftCandidate: "Roy Cooper", leftCandidateParty: "D", rightCandidate: "Michael Whatley", rightCandidateParty: "R", republicanProbability: 0.1 },
  NE: { incumbent: "R", incumbentName: "Pete Ricketts", leftCandidate: "Dan Osborn", leftCandidateParty: "I", rightCandidate: "Pete Ricketts", rightCandidateParty: "R", republicanProbability: 0.7 },
  NH: { incumbent: "D", incumbentName: "Jeanne Shaheen", leftCandidate: "Chris Pappas", leftCandidateParty: "D", rightCandidate: "John Sununu", rightCandidateParty: "R", republicanProbability: 0.15 },
    NJ: { incumbent: "D", incumbentName: "Cory Booker", leftCandidate: "Cory Booker", leftCandidateParty: "D", rightCandidate: "Justin Murphy", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  NM: { incumbent: "D", incumbentName: "Ben Ray Lujan", leftCandidate: "Ben Ray Lujan", leftCandidateParty: "D", rightCandidate: "Larry Marker", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  OH: { incumbent: "R", incumbentName: "Jon Husted", leftCandidate: "Sherrod Brown", leftCandidateParty: "D", rightCandidate: "Jon Husted", rightCandidateParty: "R", republicanProbability: 0.4 },
  OK: { incumbent: "R", incumbentName: "Alan Armstrong", leftCandidate: "N'Kiyla Thomas", leftCandidateParty: "D", rightCandidate: "Kevin Hern", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  OR: { incumbent: "D", incumbentName: "Jeff Merkley", leftCandidate: "Jeff Merkley", leftCandidateParty: "D", rightCandidate: "David Smith", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  RI: { incumbent: "D", incumbentName: "Jack Reed", leftCandidate: "Jack Reed", leftCandidateParty: "D", rightCandidate: "Raymond McKay", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  SC: { incumbent: "R", incumbentName: "Darline Graham", leftCandidate: "Annie Andrews", leftCandidateParty: "D", rightCandidate: "Darline Graham", rightCandidateParty: "R", republicanProbability: 0.75 },
  SD: { incumbent: "R", incumbentName: "Mike Rounds", leftCandidate: "Brian Bengs", leftCandidateParty: "I", rightCandidate: "Mike Rounds", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  TN: { incumbent: "R", incumbentName: "Bill Hagerty", leftCandidate: "Marquita Bradshaw", leftCandidateParty: "D", rightCandidate: "Bill Hagerty", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  TX: { incumbent: "R", incumbentName: "John Cornyn", leftCandidate: "James Talarico", leftCandidateParty: "D", rightCandidate: "Ken Paxton", rightCandidateParty: "R", republicanProbability: 0.5 },
  VA: { incumbent: "D", incumbentName: "Mark Warner", leftCandidate: "Mark Warner", leftCandidateParty: "D", rightCandidate: "Bert Mizusawa", rightCandidateParty: "R", republicanProbability: 1-safeWinProbability },
  WV: { incumbent: "R", incumbentName: "Shelley Moore Capito", leftCandidate: "Rachel Fetty Anderson", leftCandidateParty: "D", rightCandidate: "Shelley Moore Capito", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  WY: { incumbent: "R", incumbentName: "Cynthia Lummis", leftCandidate: "James Byrd", leftCandidateParty: "D", rightCandidate: "Harriet Hageman", rightCandidateParty: "R", republicanProbability: safeWinProbability },
  };
};

// Incumbents do not depend on the safe-race probability.
export const senate2026Incumbents = Object.fromEntries(
  Object.entries(senate2026Races(0.95)).map(([state, race]) => [state, race.incumbent]),
) as Partial<Record<State, "R" | "D" | "I" | null>>;

export const initialSenateProbabilities = (safeRaceProbability: number) => Object.fromEntries(
  Object.entries(senate2026Races(safeRaceProbability)).map(([state, race]) => {
    const leftCandidate = race.leftCandidateParty === "R"
      ? race.republicanProbability
      : race.rightCandidateParty === "R" ? 1 - race.republicanProbability : 0.5;
    const rightCandidate = 1 - leftCandidate;
    return [state, {
      leftCandidate,
      rightCandidate,
      leftCandidateParty: race.leftCandidateParty,
      rightCandidateParty: race.rightCandidateParty,
    }];
  }),
) as Partial<Record<State, {
  leftCandidate: number;
  rightCandidate: number;
  leftCandidateParty: SenateParty;
  rightCandidateParty: SenateParty;
}>>;
