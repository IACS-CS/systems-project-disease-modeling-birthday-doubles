import { shufflePopulation } from "../../lib/shufflePopulation";

/* Update this code to simulate a simple disease model! */

export const defaultSimulationParameters = {
  infectionChance: 50,
  recoveryTime: 7, // 3 rounds for recovery
  // Add any new parameters you want here with their initial values
  //  -- you will also have to add inputs into your jsx file if you want
  // your user to be able to change these parameters.
};

/* Creates your initial population. By default, we only track whether people
are infected. Any other attributes you want to track would have to be added
as properties on your initial individual. 
*/
export const createPopulation = (size = 1600) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      daysInfected: 0, // Track how many days they've been infected
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

// Example: Maybe infect a person (students should customize this)
const updateIndividual = (person, contact, params) => {
  // If person is infected and hasn't recovered, increment their daysInfected
  if (person.infected) {
    person.daysInfected += 1;
    // If they have been infected for the set recovery time, they recover
    if (person.daysInfected >= params.recoveryTime) {
      person.infected = false;
      person.daysInfected = 0; // Reset the daysInfected as they have recovered
    }
  }

  // If the contact is infected and the person isn't infected yet, there's a chance of infection
  if (contact.infected && !person.infected) {
    if (Math.random() * 100 < params.infectionChance) {
      person.infected = true;
      person.daysInfected = 1; // Set the infection day to 1 since they're newly infected
    }
  }
};

// Example: Update population (students decide what happens each turn)
export const updatePopulation = (population, params) => {
  // Include "shufflePopulation" if you want to shuffle...
  // population = shufflePopulation(population);
  // Example logic... each person is in contact with the person next to them...
  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    // This logic just grabs the next person in line -- you will want to 
    // change this to fit your model!
    let contact = population[(i + 1) % population.length];
    // Update the individual based on the contact...
    updateIndividual(p, contact, params);
  }
  return population;
};

// Stats to track (students can add more)
// Any stats you add here should be computed by Compute Stats below
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
];

// Example: Compute stats (students customize)
export const computeStatistics = (population, round) => {
  let infected = 0;
  for (let p of population) {
    if (p.infected) {
      infected += 1; // Count the infected
    }
  }
  return { round, infected };
};