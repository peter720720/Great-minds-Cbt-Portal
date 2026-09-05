import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, PlayCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function StudentDashboard({ student, token, onStartExam }) {
    const [currentTab, setCurrentTab] = useState('exams');
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentTab === 'exams') {
            setLoading(true);
            const examClass = student.academicClass === 'All Students' ? 'all' : student.academicClass;
            axios.get(`${API_BASE_URL}/api/exams/${examClass}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setExams(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
        }
    }, [currentTab, student.academicClass, token]);

    return (
        <div className="flex-grow flex flex-col md:flex-row">
            {/* Sidebar Controls */}
            <aside className="w-full md:w-64 bg-slate-900 text-gray-300 flex flex-col p-4 gap-2.5">
                <button onClick={() => setCurrentTab('exams')} className={`p-3 text-xs uppercase font-bold tracking-wider rounded text-left transition ${currentTab === 'exams' ? 'bg-[#E1A95F] text-[#0B192C]' : 'hover:bg-slate-800'}`}>
                    💻 CBT Assessments
                </button>
                <button onClick={() => setCurrentTab('assignments')} className={`p-3 text-xs uppercase font-bold tracking-wider rounded text-left transition ${currentTab === 'assignments' ? 'bg-[#E1A95F] text-[#0B192C]' : 'hover:bg-slate-800'}`}>
                    📝 Assignments & Tests
                </button>
            </aside>

            {/* Core Display Console */}
            <main className="flex-grow p-6">
                <section className="bg-white border border-slate-200 rounded shadow-sm p-5 mb-6 flex flex-wrap items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#E1A95F] text-[#0B192C] font-black text-lg flex items-center justify-center overflow-hidden border-2 border-white shadow">
                        {student.profilePicture ? <img src={student.profilePicture} alt={student.fullName} className="w-full h-full object-cover" /> : student.fullName?.split(' ').map((name) => name[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 text-xs flex-1">
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Full name</p><p className="font-bold text-[#0B192C]">{student.fullName}</p></div>
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Student ID</p><p className="font-bold text-[#0B192C]">{student.studentId}</p></div>
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Class</p><p className="font-bold text-[#0B192C]">{student.academicClass}</p></div>
                        <div><p className="text-[10px] uppercase font-bold text-gray-400">Email</p><p className="font-bold text-[#0B192C] break-all">{student.email || 'Not available'}</p></div>
                    </div>
                </section>
                {currentTab === 'assignments' && (
                    <div className="bg-white p-6 rounded shadow border border-gray-200 max-w-xl">
                        <h3 className="font-bold text-sm uppercase text-[#0B192C] mb-2">Class Assignments Desk</h3>
                        <p className="text-xs text-gray-400 italic">No fresh homework parameters distributed for {student.academicClass} today.</p>
                    </div>
                )}

                {currentTab === 'exams' && (
                    <div>
                        <h3 className="font-bold text-sm uppercase text-[#0B192C] mb-4">Scheduled CBT Examination Slots</h3>
                        {loading ? (
                            <p className="text-xs text-gray-400 animate-pulse font-medium">Fetching active tests...</p>
                        ) : exams.length === 0 ? (
                            <div className="p-6 bg-amber-50 border border-amber-200 rounded max-w-md text-amber-800 text-xs flex gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                <p>No exam has been uploaded yet. Please check again soon.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {exams.map(exam => (
                                    <div key={exam._id} className="bg-white p-5 rounded shadow border border-gray-100 flex justify-between items-center group hover:border-[#E1A95F] transition">
                                        <div>
                                            <h4 className="font-bold text-sm text-[#0B192C] capitalize">{exam.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Subject: {exam.subject} | Timeframe: {exam.durationMinutes} Mins</p>
                                        </div>
                                        <button 
                                            onClick={() => onStartExam(exam)}
                                            className="bg-[#0B192C] text-white p-2.5 rounded-full hover:bg-[#E1A95F] hover:text-[#0B192C] transition shadow"
                                        >
                                            <PlayCircle size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
