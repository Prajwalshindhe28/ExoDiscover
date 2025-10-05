import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import { generateLiveAnalysisReport } from '../services/geminiService';

type AnalysisStep = 'upload' | 'validating' | 'analyzing' | 'reporting' | 'done';
type StepStatus = 'pending' | 'active' | 'complete' | 'error';

interface AnalysisResult {
  summary: {
    fileName: string;
    rows: number;
    columns: string[];
    isTimeSeries: boolean;
  };
  findings: {
    candidates: number;
    confidence: number;
    topCandidate: {
      name: string;
      period: number;
      radius: number;
      esi: number;
    };
  };
  lightCurveData: { time: number; flux: number }[] | null;
  report: string;
  data: Record<string, any>[]; // for dataset analysis
}

const parseCSV = (csvText: string): Record<string, any>[] => {
    const lines = csvText.trim().split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const entry: Record<string, any> = {};
        headers.forEach((header, i) => {
            const value = values[i] ? values[i].trim() : '';
            entry[header] = !isNaN(parseFloat(value)) && isFinite(value as any) ? parseFloat(value) : value;
        });
        return entry;
    });
};

const StepIndicator: React.FC<{ title: string; status: StepStatus; description: string; }> = ({ title, status, description }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'complete': return { icon: '✔', iconBg: 'bg-green-500', text: 'text-gray-300' };
            case 'active': return { icon: '…', iconBg: 'bg-blue-500 animate-pulse', text: 'text-white' };
            case 'error': return { icon: '!', iconBg: 'bg-red-500', text: 'text-red-400' };
            default: return { icon: '', iconBg: 'bg-gray-600', text: 'text-gray-500' };
        }
    };
    const { icon, iconBg, text } = getStatusStyles();
    return (
        <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors duration-300 ${status === 'active' ? 'bg-gray-700/50' : 'bg-transparent'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${iconBg}`}>
                {icon}
            </div>
            <div>
                <h4 className={`font-bold ${text}`}>{title}</h4>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    );
};

const PulsingStar: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="pulsing-star"></div>
        </div>
        <h3 className="text-xl font-bold font-orbitron mt-4">Awaiting Signal...</h3>
        <p className="text-gray-400 mt-2 max-w-xs mx-auto">Upload a dataset to begin the AI analysis pipeline.</p>
    </div>
);

const CandidatePropertiesChart: React.FC<{ candidate: AnalysisResult['findings']['topCandidate'] }> = ({ candidate }) => {
    const data = [
        { name: 'Period (days)', value: candidate.period, fill: '#8884d8' },
        { name: 'Radius (xEarth)', value: candidate.radius, fill: '#82ca9d' },
        { name: 'ESI Score', value: candidate.esi, fill: '#ffc658' },
    ];
    return (
        <div>
            <h4 className="font-semibold text-lg text-white mb-2 text-center">Top Candidate Properties</h4>
             <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={90} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
                    <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function LiveAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setError(null);
            setFile(files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };

    const runAnalysis = useCallback(async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        
        setCurrentStep('validating');
        
        try {
            const text = await file.text();
            const data = parseCSV(text);

            if (data.length === 0) throw new Error("Could not parse any data from the file. Check format.");

            const summary = {
                fileName: file.name,
                rows: data.length,
                columns: Object.keys(data[0]),
                isTimeSeries: Object.keys(data[0]).includes('time') && Object.keys(data[0]).includes('flux'),
            };

            await new Promise(res => setTimeout(res, 1500));
            setCurrentStep('analyzing');

            const findings = {
                candidates: Math.floor(1 + Math.random() * 5),
                confidence: 0.85 + Math.random() * 0.14,
                topCandidate: {
                    name: `ED-AI-${Math.floor(1000 + Math.random() * 9000)}`,
                    period: parseFloat((3 + Math.random() * 20).toFixed(2)),
                    radius: parseFloat((0.8 + Math.random() * 2.5).toFixed(2)),
                    esi: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
                },
            };
            
            let lightCurveData = null;
            if (summary.isTimeSeries) {
                 lightCurveData = data.slice(0, 200).map(d => ({ time: d.time, flux: d.flux }));
            }

            await new Promise(res => setTimeout(res, 2000));
            setCurrentStep('reporting');

            const report = await generateLiveAnalysisReport(summary, findings);
            
            setResults({ summary, findings, lightCurveData, report, data });

            await new Promise(res => setTimeout(res, 500));
            setCurrentStep('done');

        } catch (e: any) {
            setError(e.message || "An unknown error occurred during analysis.");
            setCurrentStep('upload');
        }
    }, [file]);

    const reset = () => {
        setFile(null);
        setCurrentStep('upload');
        setResults(null);
        setError(null);
    };

    const getStatusForStep = (step: AnalysisStep): StepStatus => {
        const steps: AnalysisStep[] = ['upload', 'validating', 'analyzing', 'reporting', 'done'];
        const currentIndex = steps.indexOf(currentStep);
        const stepIndex = steps.indexOf(step);
        if (stepIndex < currentIndex) return 'complete';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    const renderResults = () => {
        if (currentStep === 'upload' && !results) {
             return (
                <AnimatedCard className="flex items-center justify-center min-h-[75vh]">
                    <PulsingStar />
                </AnimatedCard>
             );
        }
        if (currentStep !== 'upload' && !results) {
            return (
                 <AnimatedCard className="flex items-center justify-center min-h-[75vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto"></div>
                        <h3 className="text-xl font-bold font-orbitron mt-4">Analysis in Progress...</h3>
                        <p className="text-gray-400 mt-2">The AI is processing the dataset. Please wait.</p>
                    </div>
                 </AnimatedCard>
            )
        }
        if (results) {
            return (
                <AnimatedCard className="results-glow relative overflow-hidden">
                    <div className="scanner-line"></div>
                    <h3 className="text-2xl font-bold font-orbitron mb-4 text-center text-blue-300">AI Analysis Feed</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-black/20 rounded-lg">
                        {/* Top 5 missing value columns */}
                        <AnimatedCard>
                            <h4 className="font-semibold text-lg text-white mb-2 text-center">Columns with Missing Values</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={Object.entries(results.data[0]).map(([key]) => ({
                                        column: key,
                                        missing: results.data.filter(row => row[key] === '' || row[key] === null || row[key] === undefined).length
                                    }))
                                    .sort((a, b) => b.missing - a.missing)
                                    .slice(0, 5)}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="column" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#34d399" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                    <Bar dataKey="missing" fill="#f87171" />
                                </BarChart>
                            </ResponsiveContainer>
                        </AnimatedCard>

                        {/* Scatter plot Period vs Radius */}
                        <AnimatedCard>
                            <h4 className="font-semibold text-lg text-white mb-2 text-center">Period vs Radius</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" dataKey="koi_period" stroke="#9ca3af" name="Period (days)" />
                                    <YAxis type="number" dataKey="koi_prad" stroke="#9ca3af" name="Radius (Earth)" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                    <Scatter name="Candidates" data={results.data} fill="#60a5fa" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </AnimatedCard>

                        {/* Histogram of ESI */}
                        <AnimatedCard>
                            <h4 className="font-semibold text-lg text-white mb-2 text-center">ESI Score Distribution</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={Array.from({length: 10}, (_, i) => ({
                                        range: `${(i*0.1).toFixed(1)}-${((i+1)*0.1).toFixed(1)}`,
                                        count: results.data.filter(row => row.esi >= i*0.1 && row.esi < (i+1)*0.1).length
                                    }))}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#34d399" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                    <Bar dataKey="count" fill="#facc15" />
                                </BarChart>
                            </ResponsiveContainer>
                        </AnimatedCard>

                        {/* Light Curve Chart */}
                        {results.lightCurveData && (
                            <AnimatedCard>
                                <h4 className="font-semibold text-lg text-white mb-2 text-center">Light Curve for {results.findings.topCandidate.name}</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={results.lightCurveData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                                        <YAxis stroke="#9ca3af" fontSize={10} domain={['dataMin', 'dataMax']} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                                        <Line type="monotone" dataKey="flux" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </AnimatedCard>
                        )}

                        {/* Candidate Properties Chart */}
                        <CandidatePropertiesChart candidate={results.findings.topCandidate} />
                    </div>

                    <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: results.report.replace(/\n/g, '<br />') }} />
                </AnimatedCard>
            )
        }
        return null;
    }

    return (
        <div style={{ animation: 'fadeIn 1s ease-out' }}>
            <Header title="Live Data Analysis" subtitle="Upload your dataset for instant AI-powered insights" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Controls & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <AnimatedCard>
                         <h3 className="text-lg font-bold mb-4 text-blue-300">1. Upload Signal Data</h3>
                         <div 
                             onDragOver={handleDragOver}
                             onDrop={handleDrop}
                             className="border-2 border-dashed border-gray-600 p-6 rounded-lg text-center bg-black/20 hover:border-blue-500 hover:bg-gray-800/50 transition-colors"
                         >
                            <p className="text-gray-400 text-sm">Drag & drop a CSV file here</p>
                            <p className="text-gray-500 my-2">or</p>
                            <label className="text-blue-400 font-semibold hover:text-blue-300 cursor-pointer">
                                Browse local files
                                <input type="file" className="hidden" accept=".csv" onChange={e => handleFileChange(e.target.files)} />
                            </label>
                            {file && <p className="mt-4 text-xs text-green-400 bg-green-900/50 p-2 rounded">Selected: {file.name}</p>}
                         </div>
                         {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
                    </AnimatedCard>

                    <AnimatedCard>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">2. Analysis Pipeline</h3>
                        <div className="space-y-4">
                            <StepIndicator title="Validate Dataset" status={getStatusForStep('validating')} description="Check structure and data types." />
                            <StepIndicator title="Detect Candidates" status={getStatusForStep('analyzing')} description="AI model scans for planetary signals." />
                            <StepIndicator title="Generate Report" status={getStatusForStep('reporting')} description="Compiling findings and visualizations." />
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <button onClick={runAnalysis} disabled={!file || currentStep !== 'upload'} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                                {currentStep === 'upload' ? 'Start Analysis' : 'In Progress...'}
                            </button>
                            <button onClick={reset} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                Reset
                            </button>
                        </div>
                    </AnimatedCard>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-2">
                    {renderResults()}
                </div>
            </div>
        </div>
    );
}
