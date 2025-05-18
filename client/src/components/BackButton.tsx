import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

type BackButtonProps = {
  to: string;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center text-gray-600 round"
    >
      <BiArrowBack className="mr-2" size={20} />
    </button>
  );
}
