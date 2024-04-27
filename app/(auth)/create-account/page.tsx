"use client";

// import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useFormState } from "react-dom";
// import Button from "../../components/button";
import Input from "../../components/input";
// import SocialLogin from "../../components/social-login";
import {
  SVGMailIcon,
  SVGPasswordCheckIcon,
  SVGPasswordIcon,
  SVGUserIcon,
} from "@/app/components/svgIcons";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="Input_Form_Div h-[31rem]">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl my-2">Hello!</h1>
        <h2 className="text-xl my-2">Fill in the form below to join!</h2>
      </div>
      <form className="Input_Form" action={dispatch}>
        <Input
          type={"text"}
          placeholder={"Username"}
          required={true}
          name={"username"}
          errors={state?.fieldErrors.username}
          Icon={<SVGUserIcon />}
          // minLength={3}
          // maxLength={10}
        />

        <Input
          type={"email"}
          placeholder={"Email"}
          required={true}
          name={"email"}
          errors={state?.fieldErrors.email}
          Icon={<SVGMailIcon />}
        />

        <Input
          type={"password"}
          placeholder={"Password"}
          required={true}
          name={"password"}
          errors={state?.fieldErrors.password}
          // minLength={PASSWORD_MIN_LENGTH}
          Icon={<SVGPasswordIcon />}
        />

        <Input
          type={"password"}
          placeholder={"Confirm Password"}
          required={true}
          name={"confirm_password"}
          errors={state?.fieldErrors.confirm_password}
          // minLength={PASSWORD_MIN_LENGTH}
          Icon={<SVGPasswordCheckIcon />}
        />

        <input
          type="submit"
          className="btn btn-primary mb-1"
          value={"Sign Up"}
        ></input>
        <div className='flex p-2 space-x-2'>
          <span>Already have an account? </span>
          <a className="link link-primary" href={"/"}>
            Sign In
          </a>
        </div>
        {/* <Button text={"Create account"} /> */}
      </form>
      {/* <SocialLogin /> */}
    </div>
  );
}
