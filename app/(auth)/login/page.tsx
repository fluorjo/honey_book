"use client";
import { useFormState } from "react-dom";
import Input from "../../components/input";
import { SVGMailIcon, SVGPasswordIcon } from "../../components/svgIcons";
import { login } from "./loginAction";
export default function Home() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="Input_Form_Div">
      {/* <DarkModeToggleButton /> */}
      <div className="flex flex-col items-center space-y-4">
        <h1>Bee-Tweet</h1>
        <h3>Sign in</h3>
      </div>
      <form action={dispatch} className="Input_Form">

        <Input
          name="email"
          type={"email"}
          placeholder={"Email"}
          required={true}
          errors={state?.fieldErrors.email}
          Icon={<SVGMailIcon />}
        />
        {/* </label> */}
        <Input
          name="password"
          type={"password"}
          placeholder={"Password"}
          required={true}
          // minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
          Icon={<SVGPasswordIcon />}
        />
        <input
          type="submit"
          className="btn btn-primary"
          value={"Sign In"}
        ></input>
      </form>
      <div>
        <div>
          <span>Don't have an account? </span>
          {/* <Link href={"/create-account"} passHref> */}
          <a className="link link-primary" href={"/create-account"}>
            Sign Up
          </a>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
}
