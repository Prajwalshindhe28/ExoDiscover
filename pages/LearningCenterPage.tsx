import React from 'react';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';

const missions = [
  {
    name: "Kepler",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kepler_Space_Telescope_spacecraft_model_2.png/500px-Kepler_Space_Telescope_spacecraft_model_2.png",
    duration: "2009 - 2018",
    discoveries: "2,662 confirmed",
    method: "Transit Photometry",
    description: "NASA's Kepler was a revolutionary planet hunter. Its mission was to stare at a single, dense patch of stars in the Cygnus constellation, continuously monitoring their brightness. By detecting tiny, periodic dips in starlight caused by a planet passing in front of its star (a 'transit'), Kepler provided the first large-scale census of exoplanets, revealing that planets are more common than stars. Its legacy data continues to yield discoveries even today."
  },
  {
    name: "TESS",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Transiting_Exoplanet_Survey_Satellite_artist_concept_%28transparent_background%29.png/500px-Transiting_Exoplanet_Survey_Satellite_artist_concept_%28transparent_background%29.png",
    duration: "2018 - Present",
    discoveries: "400+ confirmed, 6000+ candidates",
    method: "All-Sky Transit Survey",
    description: "The Transiting Exoplanet Survey Satellite (TESS) is Kepler's successor, but with a different strategy. Instead of staring deep, it scans nearly the entire sky, searching for transiting planets around the nearest and brightest stars. This approach creates a 'best of' catalog of nearby worlds, providing prime targets for detailed atmospheric studies by telescopes like James Webb to search for biosignatures."
  },
  {
    name: "JWST",
    image: "https://room.eu.com/images/contents/issue31-essential-guide-to-the-james-webb-space-telescope.jpg",
    duration: "2021 - Present",
    discoveries: "Atmospheric Characterization",
    method: "Infrared Spectroscopy",
    description: "The James Webb Space Telescope is not primarily a planet-finder, but the premier tool for characterization. Its powerful infrared instruments can analyze the starlight filtering through an exoplanet's atmosphere during a transit. This technique, called transmission spectroscopy, allows scientists to detect the chemical fingerprints of gases like water, methane, and carbon dioxide, providing unprecedented insights into the composition and potential habitability of distant worlds."
  },
  {
    name: "K2 Mission",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1200&auto=format&fit=crop",
    duration: "2014 - 2018",
    discoveries: "300+ confirmed",
    method: "Varied Field Photometry",
    description: "After a mechanical failure ended Kepler's primary mission, engineers devised the brilliant K2 mission. Using the pressure of sunlight to stabilize the spacecraft, K2 observed different patches of the sky for about 80 days each. This new mission not only continued discovering exoplanets but also studied a wide range of astrophysical phenomena, including supernovae, young stars, and asteroids, showcasing incredible scientific ingenuity."
  }
];

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center p-2">
        <p className="text-2xl font-bold font-orbitron text-blue-300">{value}</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

export default function LearningCenterPage() {
    return (
        <div style={{ animation: 'fade-in-up 0.8s ease-out' }}>
            <Header title="Learning Center" subtitle="Explore the pioneering missions that discovered thousands of new worlds" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {missions.map((mission, index) => (
                    <div key={mission.name} className="flex" style={{ animation: `fade-in-up ${0.5 + index * 0.15}s ease-out both` }}>
                        <AnimatedCard className="flex flex-col w-full">
                            <div className="relative h-48 w-full -m-6 mb-4 ml-1 overflow-hidden rounded-t-xl mission-card-bg" style={{ backgroundImage: `url(${mission.image})`, backgroundPosition: 'center' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-gray-800/20 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-3xl font-bold font-orbitron text-white">{mission.name}</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2 my-4 border-y border-gray-700/50 py-2">
                                <Stat label="Duration" value={mission.duration} />
                                <Stat label="Discoveries" value={mission.discoveries} />
                                <Stat label="Method" value={mission.method} />
                            </div>

                            <p className="text-gray-400 text-sm flex-grow">
                                {mission.description}
                            </p>
                        </AnimatedCard>
                    </div>
                ))}
            </div>
        </div>
    );
}