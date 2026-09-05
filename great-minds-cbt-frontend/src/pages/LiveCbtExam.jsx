import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function LiveCbtExam({ exam, student, token, onExamClose }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [finished, setFinished] = useState(false);
    const [scoreMetric, setScoreMetric] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
    const selectedAnswersRef = useRef(selectedAnswers);

    const handleAnswerSelect = (qIndex, optIndex) => {
        const nextAnswers = { ...selectedAnswersRef.current, [qIndex]: optIndex };
        selectedAnswersRef.current = nextAnswers;
        setSelectedAnswers(nextAnswers);
    };

    const handleExamSubmission = async (isTimedOut = false) => {
        if (finished || submitting) return;
        setSubmitting(true);
        let calculatedScore = 0;

        exam.questions.forEach((q, idx) => {
            if (selectedAnswersRef.current[idx] === q.correctOptionIndex) {
                calculatedScore++;
            }
        });

        try {
            await axios.post(`${API_BASE_URL}/api/exams/submit-result`, {
                examId: exam._id,
                score: calculatedScore,
                totalQuestions: exam.questions.length
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setScoreMetric(calculatedScore);
            setFinished(true);
        } catch (err) {
            if (!isTimedOut) alert('Failed to transmit scorecard details safely.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (finished) return undefined;

        const timer = window.setInterval(() => {
            setSecondsRemaining((current) => {
                if (current <= 1) {
                    window.clearInterval(timer);
                    handleExamSubmission(true);
                    return 0;
                }
                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [finished]);

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = String(secondsRemaining % 60).padStart(2, '0');

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white rounded shadow-md border-t-4 border-[#E1A95F] p-6">
                {!finished ? (
                    <>
                        <div className="border-b pb-3 mb-4 flex justify-between items-center bg-slate-50 p-3 rounded">
                            <div>
                                <h3 className="font-extrabold text-sm uppercase text-[#0B192C]">{exam.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Subject Track: {exam.subject}</p>
                            </div>
                            <span className="bg-[#0B192C] text-white font-mono text-xs px-2.5 py-1 rounded shadow">
                                {minutes}:{seconds} Mins Remaining
                            </span>
                        </div>

                        <div className="space-y-5 mt-6">
                            {exam.questions.map((q, qIdx) => (
                                <div key={q._id} className="text-xs bg-slate-50/60 p-4 rounded border border-gray-100">
                                    <p className="font-bold text-gray-800 mb-3">{qIdx + 1}. {q.questionText}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {q.options.map((opt, optIdx) => (
                                            <label 
                                                key={optIdx} 
                                                className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 transition text-[11px] font-medium ${selectedAnswers[qIdx] === optIdx ? 'bg-amber-50 border-[#E1A95F] text-[#0B192C] font-bold' : 'bg-white hover:bg-gray-50'}`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`question-${qIdx}`} 
                                                    checked={selectedAnswers[qIdx] === optIdx} 
                                                    onChange={() => handleAnswerSelect(qIdx, optIdx)} 
                                                    className="accent-[#0B192C]" 
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleExamSubmission} 
                            disabled={submitting}
                            className="mt-8 w-full bg-[#0B192C] text-white text-xs font-bold uppercase py-3.5 rounded tracking-wider shadow hover:bg-slate-800 disabled:bg-gray-300"
                        >
                            {submitting ? 'Transmitting Assessment Metrics...' : 'Finalize & Submit Scorecard'}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                        <h4 className="font-extrabold text-lg text-[#0B192C] uppercase">Assessment Logged Successfully</h4>
                        <p className="text-xs text-gray-400 mt-1">Your response sheets have been securely committed to the cluster database.</p>
                        
                        <div className="my-6 bg-slate-50 border p-4 rounded-lg inline-block px-8">
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Obtained Grade Score</p>
                            <p className="text-3xl font-black text-[#0B192C] mt-1">{scoreMetric} / {exam.questions.length}</p>
                        </div>
                        
                        <button 
                            onClick={onExamClose} 
                            className="block bg-gray-200 text-gray-700 text-xs font-bold uppercase px-6 py-2.5 rounded mx-auto hover:bg-gray-300 transition"
                        >
                            Return To Hub Panel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
