import React, { useState } from 'react';
import axios from 'axios';
import { Award, Key, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function StudentAuth({ onAuthSuccess }) {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: '', text: '' });
        setLoading(true);

        const payload = { studentId, password };

        try {
            const res = await axios.post(`${API_BASE_URL}/api/student/login`, payload);
            onAuthSuccess(res.data.student, res.data.token);
        } catch (err) {
            setFeedback({ type: 'error', text: err.response?.data?.message || 'Portal authentication dropped.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow-xl w-full max-w-md border-t-4 border-[#0B192C]">
                <div className="text-center mb-6">
                    <Award size={40} className="text-[#E1A95F] mx-auto mb-2" />
                    <h2 className="text-xl font-black uppercase text-[#0B192C] tracking-tight">Login to Your CBT Exam</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Continuous Assessment & Exam Center</p>
                </div>

                {feedback.text && (
                    <div className={`p-3 text-xs font-bold rounded mb-4 ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {feedback.text}
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Portal Student ID</label>
                        <div className="relative">
                            <GraduationCap size={15} className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border p-2.5 pl-9 text-xs rounded focus:outline-[#0B192C]" placeholder="e.g., GM/P1/2026/012" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secure Password Key</label>
                        <div className="relative">
                            <Key size={15} className="absolute left-3 top-3.5 text-gray-400" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2.5 pl-9 text-xs rounded focus:outline-[#0B192C]" placeholder="••••••••" required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#0B192C] text-white text-xs font-bold uppercase py-3 rounded hover:bg-slate-800 transition tracking-widest shadow disabled:bg-gray-400">
                        {loading ? 'Authenticating System...' : 'Login to CBT Exam'}
                    </button>
                </form>
            </div>
        </div>
    );
}
