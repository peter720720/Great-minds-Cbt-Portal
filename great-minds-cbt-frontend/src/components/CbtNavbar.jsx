import React from 'react';
import { LogOut, GraduationCap, Award } from 'lucide-react';

export default function CbtNavbar({ student, onLogout }) {
    return (
        <header className="bg-[#0B192C] text-white px-6 py-4 flex justify-between items-center shadow-md border-b-2 border-[#E1A95F]">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E1A95F] text-[#0B192C] font-black flex items-center justify-center border-2 border-white shadow">
                    GM
                </div>
                <div>
                    <h1 className="font-extrabold text-xs md:text-sm tracking-wide uppercase flex items-center gap-1.5">
                        Great Mind Portal <span className="text-[9px] bg-[#E1A95F] text-[#0B192C] px-1.5 py-0.5 rounded-full font-bold">CBT LAYER</span>
                    </h1>
                    <p className="text-[10px] text-gray-300 font-medium">
                        Active Student: <span className="text-white font-bold">{student.fullName}</span> ({student.academicClass})
                    </p>
                </div>
            </div>
            <button 
                onClick={onLogout} 
                className="flex items-center gap-1.5 text-xs font-bold uppercase bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition shadow"
            >
                <LogOut size={13} /> Disconnect
            </button>
        </header>
    );
}
