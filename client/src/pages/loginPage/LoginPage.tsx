import BasicHeading from "../../components/BasicHeading";
import { useEffect } from "react";
import LoginButton from "./LoginButton";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/useUser";

export default function LoginPage() {
  const { isLogin, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) navigate("/orgs");
  }, [isLogin, navigate]);

  const handleLogin = () => {
    const loginUrl = login?.();
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col items-center gap-2 px-4">
        <BasicHeading
          styling="text-center"
          heading="Login to GitHub Classroom Analyzer"
        />
        <p className="text-[20px] text-center">
          Sign in with GitHub to access your classroom repositories and analyze
          student submissions.
        </p>
      </div>
      <div className="flex flex-col items-center gap-10 px-4">
        <LoginButton onClick={handleLogin} />
        <p className="text-[16px] text-center">
          Only GitHub Classroom instructors can access this tool.
        </p>
      </div>
    </div>
  );
}
