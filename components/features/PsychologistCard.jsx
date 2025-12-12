import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

export default function PsychologistCard({ psychologist }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={psychologist.profilePhoto} 
            alt={psychologist.fullName}
            className="w-20 h-20 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-xl font-bold">{psychologist.fullName}</h3>
            <p className="text-sm text-gray-600">{psychologist.title}</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {psychologist.bio || 'Deneyimli psikolog'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">{psychologist.rating || 5.0}</span>
          </div>
          <Link
            href={`/psychologists/${psychologist._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Randevu Al
          </Link>
        </div>
      </div>
    </div>
  );
}

