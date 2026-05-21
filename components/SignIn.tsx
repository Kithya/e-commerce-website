import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="text-sm font-semibold hover:text-dark-color text-light-color hoverEffect">
            Login
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
};

export default SignIn;
