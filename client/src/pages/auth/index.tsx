import React from "react";
import Victory from "../../assets/victory.svg";
import BackgroundImage from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Auth: React.FC = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[80vh] border-2 border-white opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the Aura chat
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer"
                  value="login"
                >
                  Login
                </TabsTrigger>

                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-98 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-10">
                <LoginForm />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
            <img src={BackgroundImage} alt="Background Image"/>
        </div>
      </div>
    </div>
  );
};

export default Auth;
