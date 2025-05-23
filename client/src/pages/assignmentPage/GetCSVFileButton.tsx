import { generateCSVFromOrg } from "../../utils/generateCSVFromOrg";
import { useGitHub } from "../../context/useGitHub";

interface GetCSVFileButtonProps {
  text: string;
  orgLogin: string | undefined;
}

export default function GetCSVFileButton({ text, orgLogin }: GetCSVFileButtonProps) {
  const github = useGitHub();

  const handleClick = async () => {
    if (!orgLogin) return;

    try {
      const data = await github.getAllOrganizationData(orgLogin);

      // 🔹 1. Ladataan CSV koneelle
      generateCSVFromOrg(data);

      // 🔹 2. Lähetetään sama data backendiin
      const response = await fetch("http://localhost:5000/api/upload-org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: data }), // HUOM! rows-avain
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Tallennus epäonnistui");
      }

      console.log("✅ Data tallennettu Supabaseen");
    } catch (error) {
      console.error("🚫 Virhe tallennuksessa:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between border border-[#D9D9D9] px-6 py-3 h-[40px] rounded-full w-fit min-w-[95px] gap-2 bg-[#1D1B20] hover:opacity-90 text-white"
    >
      <span className="text-xs sm:text-sm">{text}</span>
    </button>
  );
}

