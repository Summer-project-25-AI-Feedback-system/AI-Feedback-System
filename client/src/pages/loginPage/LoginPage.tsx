import BasicHeading from "../../components/BasicHeading";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  const GITHUB_OAUTH_URL = "" // TODO: add URL for GitHub OAuth

  const handleLoginClick = () => {
    window.location.href = GITHUB_OAUTH_URL;
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col items-center gap-2 px-4">
        <BasicHeading styling="text-center" heading="Login to GitHub Classroom Analyzer" />
        <p className="text-[20px] text-center">Sign in with GitHub to access your classroom repositories and analyze student submissions.</p>
      </div>
      <div className="flex flex-col items-center gap-10 px-4">
        <LoginButton onClick={handleLoginClick}/>
        <p className="text-[16px] text-center">Only GitHub Classroom instructors can access this tool.</p>
      </div>  
    </div>
  )
}
