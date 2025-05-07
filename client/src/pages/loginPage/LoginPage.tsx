import BasicHeading from "../../components/BasicHeading";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-20">
      <div>
        <BasicHeading heading="Login to GitHub Classroom Analyzer" />
        <p className="text-[20px]">Sign in with GitHub to access your classroom repositories and analyze student submissions.</p>
      </div>
      <div className="flex flex-col items-center gap-10">
        <LoginButton />
        <p className="text-[16px]">Only GitHub Classroom instructors can access this tool.</p>
      </div>  
    </div>
  )
}
