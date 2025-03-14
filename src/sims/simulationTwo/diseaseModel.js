import { shufflePopulation } from "../../lib/shufflePopulation";
//Credit to Mason Cayer and Ryan Dean for helping us with adding a shuffled population
//Credit to ChatGPT for helping us tweak code, fix syntax errors, etc.


/* Update this code to simulate a simple disease model! */

/* For this simulation, you should model a *real world disease* based on some real information about it.
*
* Options are:
* - Mononucleosis, which has an extremely long incubation period.
*
* - The flu: an ideal model for modeling vaccination. The flu evolves each season, so you can model
    a new "season" of the flu by modeling what percentage of the population gets vaccinated and how
    effective the vaccine is.
* 
* - An emerging pandemic: you can model a new disease (like COVID-19) which has a high infection rate.
*    Try to model the effects of an intervention like social distancing on the spread of the disease.
*    You can model the effects of subclinical infections (people who are infected but don't show symptoms)
*    by having a percentage of the population be asymptomatic carriers on the spread of the disease.
*
* - Malaria: a disease spread by a vector (mosquitoes). You can model the effects of the mosquito population
    (perhaps having it vary seasonally) on the spread of the disease, or attempt to model the effects of
    interventions like bed nets or insecticides.
*
* For whatever illness you choose, you should include at least one citation showing what you are simulating
* is based on real world data about a disease or a real-world intervention.
*/

/**
 * Authors: negga and tron 
 * 
 * What we are simulating: Different applications of different diseases 
 * 
 * What we are attempting to model from the real world: rabies
 * 
 * What we are leaving out of our model: how you obtain it to begin with 
 * 
 * What elements we have to add: A chance for immunity, recovery phase, antibodies, a death rate.
 * 
 * What parameters we will allow users to "tweak" to adjust the model: Death Rate, Time for recovery per patient
 * 
 * In plain language, what our model does: Simulates the rabies disease 
 * 
 */


// Default parameters -- any properties you add here
// will be passed to your disease model when it runs.


/* Creates your initial population. By default, we *only* track whether people
are infected. Any other attributes you want to track would have to be added
as properties on your initial individual. 

For example, if you want to track a disease which lasts for a certain number
of rounds (e.g. an incubation period or an infectious period), you would need
to add a property such as daysInfected which tracks how long they've been infected.

Similarily, if you wanted to track immunity, you would need a property that shows
whether people are susceptible or immune (i.e. succeptibility or immunity) */


export const defaultSimulationParameters = {
  infectionChance: 50, // Chance of transmission per encounter
  recoveryTime: 14, // Not relevant for rabies but kept for potential expansion
  incubationPeriod: 10, // Days before symptoms appear
  fatalityRate: 99.9, // Rabies is nearly always fatal once symptomatic
  vaccinationRate: 30, // Percentage of population vaccinated
  vaccineEffectiveness: 90, // How effective the vaccine is
};

export const createPopulation = (size = 1600) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize,
      y: (100 * Math.floor(i / sideSize)) / sideSize,
      infected: false,
      daysInfected: 0,
      symptomatic: false,
      deceased: false,
      vaccinated: Math.random() * 100 < defaultSimulationParameters.vaccinationRate,
    });
  }
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Symptomatic Cases", value: "symptomatic" },
  { label: "Deceased", value: "deceased" },
];

export const computeStatistics = (population, round) => {
  let infected = 0, symptomatic = 0, deceased = 0;
  for (let p of population) {
    if (p.infected) infected++;
    if (p.symptomatic) symptomatic++;
    if (p.deceased) deceased++;
  }
  return { round, infected, symptomatic, deceased };
};

export const updatePopulation = (population, params) => {
  population = shufflePopulation(population);

  for (let i = 0; i < population.length; i += 2) {
    let p1 = population[i];
    let p2 = population[i + 1] || population[0];

    updateIndividual(p1, p2, params);
    updateIndividual(p2, p1, params);
  }
  return population;
};

const updateIndividual = (person, other, params) => {
  if (person.deceased) return;

  if (person.infected) {
    person.daysInfected++;
    if (person.daysInfected >= params.incubationPeriod) {
      person.symptomatic = true;
      if (Math.random() * 100 < params.fatalityRate) {
        person.deceased = true;
      }
    }
  }

  if (!person.infected && other.infected && !other.deceased && Math.random() * 100 < params.infectionChance) {
    if (!person.vaccinated || Math.random() * 100 > params.vaccineEffectiveness) {
      person.infected = true;
    }
  }
};