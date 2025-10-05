

import { QuizQuestion, Exoplanet } from './types';

export const BASICS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is an exoplanet?",
    options: ["A planet in our Solar System", "A planet outside our Solar System", "A type of star", "A small moon"],
    correctAnswer: "A planet outside our Solar System",
    explanation: "An 'exoplanet' or 'extrasolar planet' is a planet that orbits a star outside of our solar system. The first confirmed exoplanet was discovered in the 1990s, and thousands have been found since.",
  },
  {
    question: "Which NASA telescope is famous for discovering thousands of exoplanets using the transit method?",
    options: ["Hubble", "James Webb", "Kepler", "Chandra"],
    correctAnswer: "Kepler",
    explanation: "The Kepler Space Telescope was a game-changer. It stared at a single patch of sky for years, allowing it to detect thousands of candidates by watching for the tiny, regular dips in starlight caused by transits.",
  },
  {
    question: "What is the 'transit method' for detecting exoplanets?",
    options: ["Measuring a star's wobble", "Observing a star's dimming as a planet passes in front", "Directly imaging the planet", "Analyzing the star's magnetic field"],
    correctAnswer: "Observing a star's dimming as a planet passes in front",
    explanation: "The transit method works by detecting the minuscule dimming of a star's light when a planet passes in front of it from our point of view, similar to a mini-eclipse. The amount of dimming can tell us the planet's size.",
  },
  {
    question: "A 'Super-Earth' is an exoplanet that is...",
    options: ["Larger than Earth but smaller than Neptune", "Hotter than Earth", "Made entirely of rock", "Has multiple moons"],
    correctAnswer: "Larger than Earth but smaller than Neptune",
    explanation: "Super-Earths are a class of exoplanet with a mass higher than Earth's but substantially below those of our solar system's ice giants, Uranus and Neptune. They can be rocky, oceanic, or gaseous.",
  },
    {
    question: "What is the 'habitable zone' around a star?",
    options: ["The area where gas giants form", "The region where a planet is hottest", "The area where liquid water could exist on a planet's surface", "The closest a planet can get to a star"],
    correctAnswer: "The area where liquid water could exist on a planet's surface",
    explanation: "Often called the 'Goldilocks Zone,' this is the orbital region around a star where the temperature is just right—not too hot and not too cold—for liquid water to exist on the surface of a planet, a key ingredient for life as we know it.",
  },
  {
    question: "The 'radial velocity' method detects exoplanets by observing...",
    options: ["Dips in starlight", "The gravitational lensing of light", "The tiny wobble of a star caused by a planet's gravity", "Radio waves from the planet"],
    correctAnswer: "The tiny wobble of a star caused by a planet's gravity",
    explanation: "This method detects the 'wobble' of a star caused by the gravitational pull of an orbiting planet. As the star moves toward and away from us, its light spectrum shifts (Doppler Effect), which we can measure.",
  },
  {
    question: "What is a 'Hot Jupiter'?",
    options: ["A Jupiter-sized planet orbiting very close to its star", "A rocky planet with a molten surface", "A star that is about to explode", "A planet with many active volcanoes"],
    correctAnswer: "A Jupiter-sized planet orbiting very close to its star",
    explanation: "Hot Jupiters are gas giants similar in size to Jupiter but orbiting extremely close to their host stars, often with orbital periods of just a few days. Their proximity makes them incredibly hot.",
  },
    {
    question: "How long is a 'year' on an exoplanet discovered by the transit method?",
    options: ["Always 365 days", "It's impossible to determine", "The time between two consecutive transits", "The size of the planet divided by its speed"],
    correctAnswer: "The time between two consecutive transits",
    explanation: "The time between two identical transits marks one full orbit of the exoplanet around its star, which is the definition of its year. For many exoplanets found, these 'years' can be just a few Earth days long!",
  },
];

export const MISSION_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which mission is the successor to the Hubble Space Telescope, designed to see the universe in infrared?",
    options: ["Kepler", "TESS", "James Webb Space Telescope (JWST)", "Spitzer"],
    correctAnswer: "James Webb Space Telescope (JWST)",
    explanation: "JWST is the premier space observatory of the next decade. Its large mirror and infrared sensitivity allow it to peer into the atmospheres of exoplanets as they transit their stars, searching for biosignatures.",
  },
  {
    question: "What does TESS stand for?",
    options: ["Transiting Exoplanet Survey Satellite", "Total Exoplanet Search System", "Telescope for Exoplanetary System Studies", "Trans-solar Exoplanet Signature Satellite"],
    correctAnswer: "Transiting Exoplanet Survey Satellite",
    explanation: "TESS's mission is to survey the entire sky to find transiting exoplanets around the nearest and brightest stars, creating a catalog of targets for further study by telescopes like the James Webb.",
  },
  {
    question: "The Kepler Space Telescope's primary mission was to stare at a single patch of sky in which constellation?",
    options: ["Orion", "Cygnus", "Ursa Major", "Scorpius"],
    correctAnswer: "Cygnus",
    explanation: "Kepler's field of view was a single, star-rich patch in the constellation Cygnus. By monitoring over 150,000 stars continuously, it provided a statistical census of how common planets are in our galaxy.",
  },
  {
    question: "Which observatory, located in the Atacama Desert, is crucial for ground-based exoplanet follow-up observations?",
    options: ["Arecibo Observatory", "Mauna Kea Observatory", "Very Large Telescope (VLT)", "Palomar Observatory"],
    correctAnswer: "Very Large Telescope (VLT)",
    explanation: "Located in the high, dry Atacama Desert of Chile, the VLT is one of the world's most advanced optical telescopes, crucial for confirming and characterizing exoplanet candidates discovered by space missions.",
  },
  {
    question: "What was the primary goal of the Spitzer Space Telescope?",
    options: ["To find Earth-like planets", "To study the universe in infrared light", "To map the Milky Way galaxy", "To search for black holes"],
    correctAnswer: "To study the universe in infrared light",
    explanation: "Spitzer was one of NASA's Great Observatories, studying the cosmos in infrared light. It made important contributions to exoplanet science by studying their atmospheres and detecting thermal emissions.",
  },
  {
    question: "The upcoming ARIEL mission by ESA will focus on what aspect of exoplanets?",
    options: ["Discovering new planets", "Studying the atmospheres of known exoplanets", "Mapping exoplanet surfaces", "Searching for extraterrestrial intelligence"],
    correctAnswer: "Studying the atmospheres of known exoplanets",
    explanation: "ARIEL (Atmospheric Remote-sensing Infrared Exoplanet Large-survey) will be dedicated to observing the atmospheres of about 1000 known exoplanets to understand their composition and formation.",
  },
  {
    question: "TESS is designed to scan almost the entire sky, unlike Kepler which focused on one area. This makes TESS better for finding...",
    options: ["Planets around very distant stars", "Planets around nearby, bright stars", "Only gas giant planets", "Planets that don't transit"],
    correctAnswer: "Planets around nearby, bright stars",
    explanation: "Unlike Kepler's deep stare, TESS performs a wide survey. This is ideal for finding planets around bright, nearby stars, which are much easier for other telescopes (like JWST) to study in detail.",
  },
];

export const AI_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "In the context of exoplanet hunting, what is a 'light curve'?",
    options: ["The brightness of a star over time", "The path light takes around a planet", "A measure of a planet's reflectivity", "The spectrum of a star's light"],
    correctAnswer: "The brightness of a star over time",
    explanation: "A light curve is a graph of a star's brightness plotted over time. It's the primary data source used in the transit method, where a dip in the curve can indicate a passing planet.",
  },
  {
    question: "How does AI help in analyzing light curves from missions like Kepler and TESS?",
    options: ["By physically moving the telescope", "By identifying subtle, periodic dips that humans might miss", "By calculating the star's age", "By predicting when a star will go supernova"],
    correctAnswer: "By identifying subtle, periodic dips that humans might miss",
    explanation: "The sheer volume of data from missions like TESS is too vast for humans to analyze alone. AI, particularly neural networks, excels at recognizing the subtle, repeating patterns of transits while filtering out noise.",
  },
  {
    question: "What is a 'false positive' in transit detection?",
    options: ["A confirmed exoplanet", "A signal that looks like a transit but is caused by something else", "A planet that is too small to see", "An error in the AI's code"],
    correctAnswer: "A signal that looks like a transit but is caused by something else",
    explanation: "Many things can cause a star to dim besides a planet. Common false positives include eclipsing binary stars (two stars orbiting each other), starspots, or simple instrument noise.",
  },
  {
    question: "What type of machine learning model, known for its strength in image recognition, is often adapted for classifying light curves?",
    options: ["Linear Regression", "K-Means Clustering", "Convolutional Neural Network (CNN)", "Reinforcement Learning"],
    correctAnswer: "Convolutional Neural Network (CNN)",
    explanation: "Convolutional Neural Networks (CNNs) are perfect for this task. They can be trained to recognize the specific 'U-shape' feature of a transit in a light curve, much like they recognize features in an image.",
  },
  {
    question: "The process of cleaning raw telescope data to remove instrument noise before AI analysis is called...",
    options: ["Data augmentation", "Signal processing", "Feature engineering", "Normalization"],
    correctAnswer: "Signal processing",
    explanation: "Signal processing and data pre-processing are crucial first steps. This involves removing systematic errors from the spacecraft, stellar variability, and other noise sources to make potential transit signals clearer.",
  },
  {
    question: "Why is having a 'training dataset' with confirmed planets and known false positives crucial for the AI?",
    options: ["It helps the telescope aim better", "It teaches the AI what to look for and what to ignore", "It increases the brightness of the stars", "It's not crucial, AI can learn on its own"],
    correctAnswer: "It teaches the AI what to look for and what to ignore",
    explanation: "This is the core of supervised machine learning. By showing the AI thousands of confirmed examples of what is and isn't a planet, it learns the patterns and becomes a powerful classification tool.",
  },
  {
    question: "What does the 'depth' of a transit in a light curve primarily tell us about the exoplanet?",
    options: ["Its mass", "Its temperature", "Its distance from the star", "Its size relative to its star"],
    correctAnswer: "Its size relative to its star",
    explanation: "The amount of light blocked during a transit is proportional to the planet's area relative to the star's area. A deeper dip means a larger planet (compared to its star).",
  },
];

export const EXOPLANET_DB: Exoplanet[] = [
    { id: 'trappist-1e', name: 'TRAPPIST-1e', radius: 0.91, mass: 0.77, orbitalPeriod: 6.1, insolation: 0.65, discoveryMethod: 'Transit', starType: 'M-type Dwarf' },
    { id: 'proxima-b', name: 'Proxima Centauri b', radius: 1.07, mass: 1.17, orbitalPeriod: 11.2, insolation: 0.65, discoveryMethod: 'Radial Velocity', starType: 'M-type Dwarf' },
    { id: 'kepler-186f', name: 'Kepler-186f', radius: 1.17, mass: 1.4, orbitalPeriod: 130, insolation: 0.29, discoveryMethod: 'Transit', starType: 'M-type Dwarf' },
    { id: 'kepler-452b', name: 'Kepler-452b', radius: 1.63, mass: 5.0, orbitalPeriod: 385, insolation: 1.1, discoveryMethod: 'Transit', starType: 'G-type (Sun-like)' },
    { id: 'gliese-581g', name: 'Gliese 581g', radius: 1.5, mass: 3.1, orbitalPeriod: 36.6, insolation: 0.6, discoveryMethod: 'Radial Velocity', starType: 'M-type Dwarf' },
    { id: 'hd-189733b', name: 'HD 189733b', radius: 13.4, mass: 365, orbitalPeriod: 2.2, insolation: 6300, discoveryMethod: 'Transit', starType: 'K-type Dwarf' },
    { id: '55-cancri-e', name: '55 Cancri e', radius: 1.87, mass: 8.0, orbitalPeriod: 0.7, insolation: 2630, discoveryMethod: 'Transit', starType: 'G-type (Sun-like)' },
    { id: 'kepler-22b', name: 'Kepler-22b', radius: 2.38, mass: 10.0, orbitalPeriod: 290, insolation: 1.1, discoveryMethod: 'Transit', starType: 'G-type (Sun-like)' },
    { id: 'k2-18b', name: 'K2-18b', radius: 2.61, mass: 8.6, orbitalPeriod: 33, insolation: 1.4, discoveryMethod: 'Transit', starType: 'M-type Dwarf' },
];

export const CANDIDATES_DATA = [
    { name: 'Transit', value: 4034 },
    { name: 'Radial Velocity', value: 921 },
    { name: 'Microlensing', value: 132 },
    { name: 'Direct Imaging', value: 58 },
    { name: 'Other', value: 45 },
];

export const CLASSIFICATION_RESULTS_DATA = [
  { id: 'K00752.01', prediction: 'CONFIRMED', score: 0.99, period: 3.9, depth: 120.4, esi: 0.88 },
  { id: 'K00752.02', prediction: 'CANDIDATE', score: 0.87, period: 8.7, depth: 89.2, esi: 0.91 },
  { id: 'K00753.01', prediction: 'FALSE POSITIVE', score: 0.95, period: 0.7, depth: 210.6, esi: 0.12 },
  { id: 'K00754.01', prediction: 'CONFIRMED', score: 0.99, period: 1.9, depth: 430.8, esi: 0.34 },
  { id: 'K00755.01', prediction: 'CONFIRMED', score: 1.00, period: 4.5, depth: 800.5, esi: 0.21 },
  { id: 'K00756.01', prediction: 'CANDIDATE', score: 0.76, period: 11.2, depth: 125.7, esi: 0.75 },
  { id: 'K00757.01', prediction: 'FALSE POSITIVE', score: 0.89, period: 0.5, depth: 1025.2, esi: 0.05 },
];

export const MODEL_PERFORMANCE_DATA = Array.from({ length: 20 }, (_, i) => ({
  epoch: i + 1,
  accuracy: 85 + i * 0.6 + Math.random() * 2,
  loss: 0.3 - i * 0.01 + Math.random() * 0.05,
}));

export const FEATURE_IMPORTANCE_DATA = [
  { name: 'Transit Depth', importance: 0.45 },
  { name: 'Orbital Period', importance: 0.25 },
  { name: 'Stellar Radius', importance: 0.15 },
  { name: 'Impact Parameter', importance: 0.10 },
  { name: 'Transit Duration', importance: 0.05 },
];

export const EXOPLANET_CONCEPTS = [
    { symbol: '🔭', name: 'Kepler Telescope', fact: 'The Kepler Space Telescope discovered thousands of exoplanets using the transit method, revolutionizing our understanding of planetary systems.' },
    { symbol: '🛰️', name: 'TESS Satellite', fact: 'TESS (Transiting Exoplanet Survey Satellite) is scanning the entire sky to find exoplanets orbiting the nearest and brightest stars.' },
    { symbol: '📉', name: 'Transit Method', fact: 'The Transit Method detects exoplanets by measuring the tiny dip in a star\'s light as a planet passes in front of it.' },
    { symbol: '🌏', name: 'Super-Earth', fact: 'A "Super-Earth" is a planet larger than Earth but smaller than Neptune. They are one of the most common types of exoplanets found.' },
    { symbol: '🔥', name: 'Hot Jupiter', fact: 'A "Hot Jupiter" is a gas giant planet that orbits extremely close to its star, resulting in scorching temperatures and very short years.' },
    { symbol: '🔴', name: 'Red Dwarf Star', fact: 'Red Dwarf stars are the most common type of star in the Milky Way. Many exoplanets, including potentially habitable ones, are found orbiting them.' },
    { symbol: '✨', name: 'Habitable Zone', fact: 'The Habitable Zone, or "Goldilocks Zone," is the region around a star where conditions might be just right for liquid water to exist on a planet\'s surface.' },
    { symbol: '↔️', name: 'Radial Velocity', fact: 'The Radial Velocity method detects the "wobble" of a star caused by the gravitational pull of an orbiting planet.' },
];

export const GAME_SYMBOLS = EXOPLANET_CONCEPTS.map(c => c.symbol);

export const LIGHT_CURVE_DEFINITIONS = [
  { id: 1, type: 'transit', isTransit: true, explanation: 'This periodic, U-shaped dip is a classic sign of a planetary transit.', difficulty: ['easy', 'medium', 'hard'] },
  { id: 2, type: 'noise', isTransit: false, explanation: 'This is random stellar noise. There is no clear, repeating pattern.', difficulty: ['easy', 'medium', 'hard'] },
  { id: 3, type: 'starspot', isTransit: false, explanation: 'This slow, V-shaped dip is more typical of a starspot rotating into view, not a transit.', difficulty: ['easy', 'medium', 'hard'] },
  { id: 4, type: 'transit-noisy', isTransit: true, explanation: 'Despite the noise, a clear periodic dip is visible, indicating a potential candidate.', difficulty: ['medium', 'hard'] },
  { id: 5, type: 'variable-star', isTransit: false, explanation: 'This signal shows a sinusoidal pattern characteristic of a variable star, not a transit.', difficulty: ['medium', 'hard'] },
  { id: 6, type: 'eclipsing-binary', isTransit: false, explanation: 'This very deep, sharp V-shaped dip suggests an eclipsing binary star system, not an exoplanet.', difficulty: ['easy', 'medium', 'hard'] },
  { id: 7, type: 'transit-small', isTransit: true, explanation: 'A very shallow but distinct U-shaped dip indicates a small planet transiting a larger star.', difficulty: ['hard'] },
  { id: 8, type: 'instrument-error', isTransit: false, explanation: 'This sharp, sudden drop is likely an instrument glitch or cosmic ray hit, not a transit.', difficulty: ['hard'] },
];