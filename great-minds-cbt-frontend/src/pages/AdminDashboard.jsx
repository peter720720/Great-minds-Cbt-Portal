import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Clipboard, KeyRound, LogIn, LogOut, Plus, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/admin`;
const classes = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'Jss 1', 'Jss 2', 'Jss 3', 'Ss 1', 'Ss 2', 'Ss 3'];
const emptyQuestion = () => ({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 });

export default function AdminDashboard() {
    const [token, setToken] = useState(localStorage.getItem('cbt_admin_token'));
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [form, setForm] = useState({ title: '', subject: '', targetClass: 'Primary 1', durationMinutes: 30, questions: [emptyQuestion()] });
    const [sharedPassword, setSharedPassword] = useState('');
    const [exams, setExams] = useState([]);
    const [feedback, setFeedback] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const loadExams = async (adminToken = token) => {
        try {
            const response = await axios.get(`${API_URL}/exams`, { headers: { Authorization: `Bearer ${adminToken}` } });
            setExams(response.data);
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data?.message || 'Unable to load examinations.' });
        }
    };

    useEffect(() => {
        if (token) loadExams();
    }, [token]);

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            localStorage.setItem('cbt_admin_token', response.data.token);
            setToken(response.data.token);
            setFeedback({ type: '', text: '' });
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data?.message || 'Admin sign-in failed.' });
        } finally {
            setLoading(false);
        }
    };

    const updateQuestion = (questionIndex, field, value) => {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, index) => index === questionIndex ? { ...question, [field]: value } : question),
        }));
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, index) => index === questionIndex
                ? { ...question, options: question.options.map((option, position) => position === optionIndex ? value : option) }
                : question),
        }));
    };

    const uploadExam = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/exams`, form, { headers: { Authorization: `Bearer ${token}` } });
            setForm({ title: '', subject: '', targetClass: 'Primary 1', durationMinutes: 30, questions: [emptyQuestion()] });
            setFeedback({ type: 'success', text: 'Examination uploaded successfully.' });
            loadExams();
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data?.message || 'Unable to upload examination.' });
        } finally {
            setLoading(false);
        }
    };

    const deleteExam = async (examId) => {
        if (!window.confirm('Delete this examination and all its questions?')) return;
        try {
            await axios.delete(`${API_URL}/exams/${examId}`, { headers: { Authorization: `Bearer ${token}` } });
            setExams((current) => current.filter((exam) => exam._id !== examId));
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data?.message || 'Unable to delete examination.' });
        }
    };

    const generateCbtPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        setSharedPassword('');
        try {
            const response = await axios.post(`${API_URL}/students/password`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setSharedPassword(response.data.password);
            setFeedback({ type: 'success', text: 'One shared CBT password generated for all students.' });
        } catch (error) {
            setFeedback({ type: 'error', text: error.response?.data?.message || 'Unable to create student account.' });
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('cbt_admin_token');
        setToken(null);
    };

    if (!token) {
        return (
            <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <form onSubmit={login} className="w-full max-w-md bg-white border-t-4 border-[#0B192C] rounded shadow-xl p-8">
                    <div className="text-center mb-7"><ShieldCheck className="mx-auto text-[#E1A95F]" size={42} /><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mt-3">Great Minds Administration</p><h1 className="text-2xl font-black text-[#0B192C] mt-1">Exam Control Center</h1></div>
                    {feedback.text && <p className="bg-red-50 text-red-700 rounded p-3 text-xs font-bold mb-4">{feedback.text}</p>}
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Admin email</label>
                    <input type="email" required value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} className="w-full border rounded p-3 text-sm mb-4" />
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                    <input type="password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="w-full border rounded p-3 text-sm mb-6" />
                    <button disabled={loading} className="w-full bg-[#0B192C] text-white rounded p-3 text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2 disabled:bg-gray-400"><LogIn size={16} /> {loading ? 'Signing in...' : 'Admin sign in'}</button>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 text-slate-800">
            <header className="bg-[#0B192C] text-white px-5 md:px-10 py-5 flex justify-between items-center border-b-2 border-[#E1A95F]">
                <div><p className="text-[10px] uppercase tracking-[0.25em] text-[#E1A95F] font-bold">Great Minds International School</p><h1 className="text-xl font-black flex items-center gap-2"><BookOpen size={20} /> Exam Control Center</h1></div>
                <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs font-bold uppercase"><LogOut size={14} /> Sign out</button>
            </header>
            <div className="max-w-7xl mx-auto p-5 md:p-8 space-y-6">
                <section className="bg-white rounded shadow-sm border border-slate-200 p-5 md:p-7">
                    <div className="mb-5"><p className="text-[10px] uppercase tracking-widest text-[#E1A95F] font-bold">Student access</p><h2 className="text-2xl font-black text-[#0B192C]">Generate shared CBT password</h2><p className="text-sm text-slate-500 mt-1">One password will work with every valid student ID.</p></div>
                    <form onSubmit={generateCbtPassword}>
                        <button disabled={loading} className="bg-[#0B192C] text-white rounded p-3 text-xs font-bold uppercase flex justify-center items-center gap-2 disabled:bg-gray-400"><KeyRound size={15} /> {loading ? 'Generating...' : 'Generate shared password'}</button>
                    </form>
                    {sharedPassword && <div className="mt-5 border border-green-200 bg-green-50 rounded p-4"><p className="text-xs font-black uppercase text-green-800 mb-3">Give this password to all students</p><p className="text-sm">Shared CBT password: <strong>{sharedPassword}</strong></p><button type="button" onClick={() => navigator.clipboard?.writeText(sharedPassword)} className="mt-3 text-xs font-bold text-green-800 flex items-center gap-1"><Clipboard size={14} /> Copy password</button></div>}
                </section>
                <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)] gap-6">
                <section className="bg-white rounded shadow-sm border border-slate-200 p-5 md:p-7">
                    <div className="mb-6"><p className="text-[10px] uppercase tracking-widest text-[#E1A95F] font-bold">Create assessment</p><h2 className="text-2xl font-black text-[#0B192C]">Upload exam questions</h2></div>
                    {feedback.text && <p className={`${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} rounded p-3 text-xs font-bold mb-5`}>{feedback.text}</p>}
                    <form onSubmit={uploadExam} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input required placeholder="Exam title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="border rounded p-3 text-sm" />
                            <input required placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="border rounded p-3 text-sm" />
                            <select value={form.targetClass} onChange={(event) => setForm({ ...form, targetClass: event.target.value })} className="border rounded p-3 text-sm bg-white">{classes.map((item) => <option key={item}>{item}</option>)}</select>
                            <input required min="1" type="number" placeholder="Duration in minutes" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })} className="border rounded p-3 text-sm" />
                        </div>
                        <div className="space-y-5">
                            {form.questions.map((question, questionIndex) => (
                                <fieldset key={questionIndex} className="border border-slate-200 rounded p-4 bg-slate-50">
                                    <legend className="px-2 text-xs font-black uppercase text-[#0B192C]">Question {questionIndex + 1}</legend>
                                    <textarea required rows="2" placeholder="Type the question" value={question.questionText} onChange={(event) => updateQuestion(questionIndex, 'questionText', event.target.value)} className="w-full border rounded p-3 text-sm bg-white mb-3" />
                                    <div className="grid sm:grid-cols-2 gap-3">{question.options.map((option, optionIndex) => <input required key={optionIndex} placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)} className="border rounded p-3 text-sm bg-white" />)}</div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mt-4">Correct option
                                        <select value={question.correctOptionIndex} onChange={(event) => updateQuestion(questionIndex, 'correctOptionIndex', Number(event.target.value))} className="ml-2 border rounded p-2 bg-white normal-case">{question.options.map((_, optionIndex) => <option key={optionIndex} value={optionIndex}>Option {String.fromCharCode(65 + optionIndex)}</option>)}</select>
                                    </label>
                                    {form.questions.length > 1 && <button type="button" onClick={() => setForm({ ...form, questions: form.questions.filter((_, index) => index !== questionIndex) })} className="text-red-600 text-xs font-bold mt-4 flex items-center gap-1"><Trash2 size={14} /> Remove question</button>}
                                </fieldset>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setForm({ ...form, questions: [...form.questions, emptyQuestion()] })} className="border border-[#0B192C] text-[#0B192C] rounded px-4 py-3 text-xs font-bold uppercase flex items-center gap-2"><Plus size={15} /> Add question</button><button disabled={loading} className="bg-[#0B192C] text-white rounded px-5 py-3 text-xs font-bold uppercase flex items-center gap-2 disabled:bg-gray-400"><Upload size={15} /> {loading ? 'Uploading...' : 'Upload examination'}</button></div>
                    </form>
                </section>
                <section className="bg-white rounded shadow-sm border border-slate-200 p-5 md:p-7 h-fit"><h2 className="text-lg font-black text-[#0B192C] mb-4">Uploaded examinations</h2>{exams.length === 0 ? <p className="text-sm text-gray-400">No examinations uploaded yet.</p> : <div className="space-y-3">{exams.map((exam) => <article key={exam._id} className="border rounded p-4"><div className="flex justify-between gap-3"><div><h3 className="font-bold text-sm text-[#0B192C]">{exam.title}</h3><p className="text-xs text-gray-500 mt-1">{exam.subject} · {exam.targetClass} · {exam.questions.length} questions</p></div><button onClick={() => deleteExam(exam._id)} title="Delete examination" className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button></div></article>)}</div>}</section>
                </div>
            </div>
        </main>
    );
}