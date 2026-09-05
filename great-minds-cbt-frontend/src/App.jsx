import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CbtNavbar from './components/CbtNavbar';
import StudentAuth from './pages/StudentAuth';
import StudentDashboard from './pages/StudentDashboard';
import LiveCbtExam from './pages/LiveCbtExam';
import AdminDashboard from './pages/AdminDashboard';
import { API_BASE_URL } from './config/api';

export default function App() {
    if (window.location.pathname === '/admin') {
        return <AdminDashboard />;
    }

    const [student, setStudent] = useState(JSON.parse(localStorage.getItem('cbt_student')) || null);
    const [token, setToken] = useState(localStorage.getItem('cbt_token') || null);
    const [activeExam, setActiveExam] = useState(JSON.parse(localStorage.getItem('cbt_active_exam')) || null);

    useEffect(() => {
        if (!activeExam || !token) return undefined;

        axios.get(`${API_BASE_URL}/api/exams/id/${activeExam._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setActiveExam(response.data);
            localStorage.setItem('cbt_active_exam', JSON.stringify(response.data));
        }).catch(() => {
            localStorage.removeItem('cbt_active_exam');
            setActiveExam(null);
        });
    }, [activeExam?._id, token]);

    const handleAuthSuccess = (studentData, tokenData) => {
        localStorage.setItem('cbt_student', JSON.stringify(studentData));
        localStorage.setItem('cbt_token', tokenData);
        setStudent(studentData);
        setToken(tokenData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setStudent(null);
        setToken(null);
        setActiveExam(null);
    };

    const handleFeesStateSync = (updatedStudent) => {
        localStorage.setItem('cbt_student', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
    };

    // View Routing Switching Conditionals
    if (!token || !student) {
        return <StudentAuth onAuthSuccess={handleAuthSuccess} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <CbtNavbar student={student} onLogout={handleLogout} />
            
            {activeExam ? (
                <LiveCbtExam 
                    exam={activeExam} 
                    student={student} 
                    token={token} 
                    onExamClose={() => {
                        localStorage.removeItem('cbt_active_exam');
                        setActiveExam(null);
                    }} 
                />
            ) : (
                <StudentDashboard 
                    student={student} 
                    token={token} 
                    onStartExam={(exam) => {
                        localStorage.setItem('cbt_active_exam', JSON.stringify(exam));
                        setActiveExam(exam);
                    }}
                    onFeesPaid={handleFeesStateSync}
                />
            )}
        </div>
    );
}
