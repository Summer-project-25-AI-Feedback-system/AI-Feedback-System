import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface SubmissionData {
  name: string;
  feedback: string;
  date: string;
  fileName: string;
  grade: string;
}

export default function SpecificUserSubmissionScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit-tilat
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (!id) {
        setError("ID puuttuu");
        setLoading(false);
        return;
      }
      setData({
        name: `Matti Meikäläinen`,
        feedback: "",
        date:
          new Date().toLocaleDateString("fi-FI") +
          " " +
          new Date().toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        fileName: `tehtava${id}.zip`,
        grade: "3/5",
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Ladataan...</div>;
  }
  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }
  if (!data) {
    return null;
  }

  // Edit-painikkeen toiminta
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFeedback(data.feedback);
  };

  const handleSave = () => {
    setData({ ...data, feedback: editedFeedback });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFeedback("");
  };

  // Download-painikkeen toiminta (simuloitu PDF)
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([data.feedback], { type: "application/pdf" });
    element.href = URL.createObjectURL(file);
    element.download = data.fileName.replace(/\.zip$/, ".pdf");
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Edit Grade -painikkeen toiminta
  const handleEditGrade = () => {
    const uusiArvosana = window.prompt(
      "Syötä uusi arvosana (esim. 4/5):",
      data.grade
    );
    if (uusiArvosana && uusiArvosana.trim() !== "") {
      setData({ ...data, grade: uusiArvosana });
    }
  };

  // Delete-painikkeen toiminta
  // const handleDelete = () => {
  //   if (
  //     window.confirm(
  //       "Haluatko varmasti poistaa koko palautuksen? Tätä toimintoa ei voi perua."
  //     )
  //   ) {
  //     navigate(-1);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center">
      <div className="max-w-[820px] w-full bg-white rounded-[16px] shadow-lg p-0 sm:p-[60px] py-[48px] border border-[#E0E0E0]">
        <div className="relative w-full h-full flex flex-col items-start">
          <div
            className="w-full h-full bg-white rounded-none shadow-none px-0 py-0 relative border-none"
            style={{ boxShadow: "none" }}
          >
            {/* Ylärivi: tekstit vasemmalle, painikkeet oikealle */}
            <div className="flex flex-row justify-between items-start w-full gap-4 mt-2 mb-2">
              <div className="flex flex-row items-start gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-0 rounded-full text-[32px] font-extrabold text-[#1E1E1E] leading-none border-none bg-transparent hover:bg-gray-100 mt-1"
                  aria-label="Takaisin"
                  style={{ fontFamily: "inherit", border: "none" }}
                >
                  &#8592;
                </button>
                <div>
                  <h1
                    className="text-[20px] font-extrabold text-[#1E1E1E] mb-1"
                    style={{ fontFamily: "inherit" }}
                  >
                    Matti Meikäläinen
                  </h1>
                  <div className="text-[#1E1E1E] text-[13px] flex flex-col gap-0.5">
                    <span>Submission time: {data.date}</span>
                    <span>Grade: {data.grade}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-end pr-8">
                <button
                  className="bg-[#1E1E1E] text-white px-6 py-1.5 rounded-full font-medium text-[13px] w-[180px] text-right"
                  style={{ boxShadow: "none", letterSpacing: 0 }}
                  onClick={handleDownload}
                >
                  Download Feedback PDF
                </button>
                <button
                  className="bg-[#1E1E1E] text-white px-6 py-1.5 rounded-full font-medium text-[13px] w-[180px] text-right"
                  style={{ boxShadow: "none", letterSpacing: 0 }}
                  onClick={handleEditGrade}
                >
                  Edit Grade
                </button>
                <button
                  className="bg-[#1E1E1E] text-white px-6 py-1.5 rounded-full font-medium text-[13px] w-[180px] text-right"
                  style={{ boxShadow: "none", letterSpacing: 0 }}
                  onClick={handleEditClick}
                  disabled={isEditing}
                >
                  Edit Feedback
                </button>
              </div>
            </div>
            {/* AI Feedback -laatikko */}
            <div className="pt-6 pb-4">
              <div className="text-[15px] font-semibold text-[#1E1E1E] mb-2">
                AI Feedback:
              </div>
              <div
                className="w-full bg-[#C7C7C7] rounded-[8px] min-h-[120px] flex items-center justify-center text-[#1E1E1E] text-[15px] p-6 border-none"
                style={{ height: 120 }}
              >
                {isEditing ? (
                  <div className="w-full">
                    <textarea
                      className="w-full border rounded p-4 min-h-[80px] bg-white text-[#1E1E1E] text-[15px]"
                      value={editedFeedback}
                      onChange={(e) => setEditedFeedback(e.target.value)}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-[13px]"
                        onClick={handleSave}
                      >
                        Tallenna
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-[13px]"
                        onClick={handleCancel}
                      >
                        Peruuta
                      </button>
                    </div>
                  </div>
                ) : data.feedback ? (
                  data.feedback
                ) : (
                  <span className="text-[#757575]">
                    Highlighted issues, what went well etc etc
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
