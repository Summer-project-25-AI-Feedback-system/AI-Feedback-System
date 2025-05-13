import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SubmissionData {
  name: string;
  feedback: string;
  date: string;
  fileName: string;
}

const SpecificUserSubmissionScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!id) {
        setError('ID puuttuu');
        setLoading(false);
        return;
      }
      setData({
        name: `Matti Meikäläinen`,
        feedback: `Highlighted issues, what went well...`,
        date: new Date().toLocaleDateString('fi-FI'),
        fileName: `tehtava${id}.zip`
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Ladataan...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 mt-10">Virhe: {error}</div>;
  }
  if (!data) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-0 sm:p-8 bg-white rounded-lg shadow relative">
      {/* Takaisin-nuoli (pelkkä teksti) */}
      <button
        className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 text-lg font-bold"
        onClick={() => navigate(-1)}
        aria-label="Takaisin"
      >
        {'<'}
      </button>

      {/* Oikean yläkulman painikkeet */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <button className="bg-black text-white px-4 py-2 rounded w-32 font-semibold">
          Download
        </button>
        <button className="bg-black text-white px-4 py-2 rounded w-32 font-semibold">
          Edit
        </button>
        <button className="bg-black text-white px-4 py-2 rounded w-32 font-semibold">
          Delete
        </button>
      </div>

      {/* Käyttäjän nimi */}
      <div className="pt-16 pb-2 px-4">
        <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
      </div>

      {/* AI Feedback -otsikko ja laatikko */}
      <div className="px-4 mb-6">
        <div className="text-lg font-semibold text-gray-700 mb-2">AI Feedback</div>
        <div className="w-full border rounded p-6 min-h-[120px] bg-gray-100 text-gray-800">
          {data.feedback}
        </div>
      </div>

      {/* Alaosan metatiedot */}
      <div className="flex items-center gap-8 text-gray-600 text-sm px-4 pb-4">
        <span>{data.date}</span>
        <span>{data.fileName}</span>
      </div>
    </div>
  );
};

export default SpecificUserSubmissionScreen;
