import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { CLASSIFICATION_RESULTS_DATA, MODEL_PERFORMANCE_DATA, FEATURE_IMPORTANCE_DATA } from '../constants';
import { generateReport } from '../services/geminiService';
import Papa from "papaparse";

const StatCard: React.FC<{ title: string; value: string; subtitle: string; }> = ({ title, value, subtitle }) => (
    <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 shadow-2xl shadow-blue-900/10 text-center">
        <p className="text-4xl font-bold font-orbitron text-white">{value}</p>
        <h3 className="text-sm font-semibold text-blue-300 mt-1">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
);

const ModelTrainer: React.FC<{ onTrain: (accuracy: number) => void }> = ({ onTrain }) => {
    const [model, setModel] = useState('XGBoost');
    const [estimators, setEstimators] = useState(300);
    const [depth, setDepth] = useState(10);
    const [isTraining, setIsTraining] = useState(false);
    
    const handleTrain = useCallback(() => {
        setIsTraining(true);
        setTimeout(() => {
            const mockAccuracy = 95.0 + Math.random() * 2.5;
            onTrain(parseFloat(mockAccuracy.toFixed(2)));
            setIsTraining(false);
        }, 2500);
    }, [onTrain]);

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="model-select" className="block text-xs font-medium text-gray-400 mb-2">Select Model</label>
                <select id="model-select" value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>Gradient Boosting</option>
                    <option>LightGBM Classifier</option>
                    <option>Ensemble Model</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">N_Estimators: {estimators}</label>
                <input type="range" min="10" max="500" step="10" value={estimators} onChange={e => setEstimators(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Max_Depth: {depth}</label>
                <input type="range" min="2" max="30" value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
            <button onClick={handleTrain} disabled={isTraining} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                {isTraining ? 'Training Model...' : 'Retrain Model'}
            </button>
        </div>
    );
};

const REQUIRED_FEATURES = [
  "koi_fpflag_nt", "koi_fpflag_ss", "koi_fpflag_co", "koi_fpflag_ec",
  "koi_period", "koi_period_err1", "koi_period_err2",
  "koi_time0bk", "koi_time0bk_err1", "koi_time0bk_err2",
  "koi_impact", "koi_impact_err1", "koi_impact_err2",
  "koi_duration", "koi_duration_err1", "koi_duration_err2",
  "koi_depth", "koi_depth_err1", "koi_depth_err2",
  "koi_prad", "koi_prad_err1", "koi_prad_err2",
  "koi_teq", "koi_insol", "koi_insol_err1", "koi_insol_err2",
  "koi_model_snr",
  "koi_steff", "koi_steff_err1", "koi_steff_err2",
  "koi_slogg", "koi_slogg_err1", "koi_slogg_err2",
  "koi_srad", "koi_srad_err1", "koi_srad_err2"
];


// Helper function to parse CSV data, robust to comments and varied number formats.
const parseCSV = (csvText: string): Record<string, any>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Filter out comment lines that start with #
    const dataLines = lines.filter(line => !line.startsWith('#'));
    if(dataLines.length < 2) return [];

    const headers = dataLines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < dataLines.length; i++) {
        const values = dataLines[i].split(',');
        if (values.length === headers.length) {
            const entry: Record<string, any> = {};
            for (let j = 0; j < headers.length; j++) {
                const header = headers[j];
                const value = values[j].trim();
                entry[header] = !isNaN(parseFloat(value)) && isFinite(value as any) && value !== '' ? parseFloat(value) : value;
            }
            data.push(entry);
        }
    }
    return data;
};

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('results');
    const [accuracy, setAccuracy] = useState(97);
    const [fileName, setFileName] = useState('Kepler Objects of Interest (KOI)');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [report, setReport] = useState('');
    const [classificationData, setClassificationData] = useState(CLASSIFICATION_RESULTS_DATA);
    
    useEffect(() => setMounted(true), []);

    const fadeInClass = (delay: string) => `transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${delay}`;

const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (!text) return;

        try {
            const parsedData = parseCSV(text);
            if (parsedData.length === 0) {
                alert("Could not parse any data rows from the CSV. Please check the file format.");
                return;
            }

            // Filter only the required 36 features
            const filteredData = parsedData.map(row => {
                const cleanedRow: Record<string, any> = {};
                REQUIRED_FEATURES.forEach(feature => {
                    cleanedRow[feature] = parseFloat(row[feature]) || 0;
                });
                return cleanedRow;
            });

            console.log("Filtered 36-feature data (first row):", filteredData[0]);

            // ✅ Send all rows in a single request to backend
            const res = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filteredData),
            });
            const predictions = await res.json();

            // Update classificationData with backend predictions
            const formattedData = parsedData.map((row, index) => ({
                id: row.kepid || row.id || `Row_${index + 1}`,
                prediction: predictions[index]?.prediction || row.koi_disposition || 'CANDIDATE',
                score: predictions[index]?.score || Number(row.koi_score || row.score || 0),
                esi: row.esi !== undefined ? Number(row.esi) : 0,
                period: row.koi_period !== undefined ? Number(row.koi_period) : Number(row.period || 0),
                depth: row.koi_depth !== undefined ? Number(row.koi_depth) : Number(row.depth || 0),
            }));

            setClassificationData(formattedData);

            // Update accuracy if backend returns it
            if (predictions[0]?.accuracy) setAccuracy(predictions[0].accuracy);

        } catch (err) {
            alert("An error occurred while parsing the file or fetching predictions.");
            console.error(err);
        }
    };

    reader.onerror = () => alert("Failed to read the file.");
    reader.readAsText(file);
}, []);

       


    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        setReport('');
        try {
            const analysisData = {
                model: 'XGBoost', // This would come from state in a more complex app
                accuracy: accuracy,
                hyperparameters: { estimators: 300, depth: 10 },
                fileName,
            };
            const generatedReport = await generateReport(analysisData);
            setReport(generatedReport);
        } finally {
            setIsGeneratingReport(false);
        }
    };
    
    const getEsiColor = (esi: number) => {
        if (esi > 0.8) return 'text-green-400';
        if (esi > 0.6) return 'text-yellow-400';
        return 'text-red-400';
    }

    return (
        <div style={{ animation: 'fadeIn 1s ease-out' }}>
            <Header title="AI Analysis Dashboard" subtitle="Interactive Exoplanet Classification & Model Performance" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className={fadeInClass('delay-100')}><StatCard title="Total Exoplanets Classified" value={classificationData.length.toLocaleString()} subtitle={fileName} /></div>
                 <div className={fadeInClass('delay-200')}><StatCard title="Model Accuracy" value={`${accuracy}%`} subtitle="Current Model" /></div>
                 <div className={fadeInClass('delay-300')}><StatCard title="High-Confidence" value={classificationData.filter(p => p.prediction === 'Confirmed Exoplanet').length.toString()} subtitle="Confirmed Planets" /></div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="lg:col-span-2 space-y-8">
                    {/* Tabs */}
                    <div className={fadeInClass('delay-[400ms]')}>
                        <div className="border-b border-gray-700">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button onClick={() => setActiveTab('results')} className={`${activeTab === 'results' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Classification Results</button>
                                <button onClick={() => setActiveTab('performance')} className={`${activeTab === 'performance' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Model Performance</button>
                            </nav>
                        </div>
                    </div>
                    {/* Content based on tab */}
                    <div className={fadeInClass('delay-[500ms]')}>
                    {activeTab === 'results' ? (
                        <AnimatedCard>
                             <h3 className="text-lg font-bold mb-4 text-blue-300">Model Classification</h3>
                             <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-grey-400 uppercase bg-gray-700 sticky top-0">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Candidate ID</th>
                                            <th scope="col" className="px-4 py-3">Prediction</th>
                                            <th scope="col" className="px-4 py-3">Confidence</th>
                                            <th scope="col" className="px-4 py-3">Orbital Period</th>
                                            <th scope="col" className="px-4 py-3">Transit Depth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classificationData.map(row => (
                                            <tr key={row.kepoi_name} className="border-b border-gray-700 hover:bg-gray-800/40">
                                                <td className="px-4 py-3 font-mono">{row.id}</td>
                                                <td className={`px-4 py-3 font-semibold ${row.prediction === 'Confirmed Exoplanet' ? 'text-green-400' : row.prediction === 'CANDIDATE' ? 'text-yellow-400' : 'text-red-400'}`}>{row.prediction}</td>
                                                <td className="px-4 py-3">{row.prediction === 'Confirmed Exoplanet' ? 1 : 0}</td>
                                                <td className="px-4 py-3">{row.period.toFixed(0)} days</td>
                                                <td className="px-4 py-3">{row.depth} ppm</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </AnimatedCard>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <AnimatedCard>
                                <h3 className="text-lg font-bold mb-4 text-blue-300">Accuracy & Loss</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={MODEL_PERFORMANCE_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="epoch" stroke="#9ca3af" fontSize={12} />
                                        <YAxis yAxisId="left" stroke="#34d399" fontSize={12} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#f87171" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#34d399" dot={false} />
                                        <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#f87171" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </AnimatedCard>
                             <AnimatedCard>
                                <h3 className="text-lg font-bold mb-4 text-blue-300">Feature Importance</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={FEATURE_IMPORTANCE_DATA} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} width={80} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                        <Bar dataKey="importance" fill="#60a5fa" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </AnimatedCard>
                        </div>
                    )}
                    </div>

                    <div className={fadeInClass('delay-[600ms]')}>
                       {report ? (
                            <AnimatedCard>
                                <h3 className="text-lg font-bold mb-2 text-blue-300">Exo-AI Analysis Report</h3>
                                <div className="prose prose-sm prose-invert max-w-none max-h-96 overflow-y-auto text-gray-300" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />
                            </AnimatedCard>
                       ) : (
                           <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="w-full bg-purple-600/80 hover:bg-purple-700/80 disabled:bg-purple-800/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2">
                               {isGeneratingReport ? (
                                   <>
                                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                   <span>Generating AI Report...</span>
                                   </>
                               ) : 'Generate AI Report'}
                           </button>
                       )}
                    </div>
                </main>

                <aside className={`lg:col-span-1 space-y-6 ${fadeInClass('delay-[700ms]')}`}>
                    <AnimatedCard>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">Dataset Files</h3>
                        <div className="space-y-3 text-sm">
                             <div className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white truncate" title={fileName}>
                                {fileName}
                            </div>
                             <label className="w-full bg-gray-700/50 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg cursor-pointer flex items-center justify-center transition-colors text-xs">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <span>Upload New Data</span>
                                <input type='file' className="hidden" onChange={handleFileUpload} accept=".csv,.txt"/>
                            </label>
                        </div>
                    </AnimatedCard>
                     <AnimatedCard>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">Model Controls</h3>
                        <ModelTrainer onTrain={setAccuracy} />
                    </AnimatedCard>
                </aside>
            </div>
        </div>
    );
};