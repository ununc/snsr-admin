import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/signin",
        {
          id,
          password: pw,
        },
        { withCredentials: true }
      );
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/menu");
    } catch {
      alert("로그인 실패");
      sessionStorage.removeItem("isLoggedIn");
    }
  }, [id, pw, navigate]);

  const pressEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      onKeyDown={pressEnter}
      className="flex flex-col h-full justify-center items-center"
    >
      <div className="max-w-80 flex flex-col gap-4 mb-16">
        <div>
          ID
          <Input
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              setId(event.target.value);
            }}
          ></Input>
        </div>
        <div>
          PassWord
          <Input
            type="password"
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPw(event.target.value);
            }}
          ></Input>
        </div>
        <Button type="button" onClick={handleLogin}>
          로그인
        </Button>
      </div>
    </div>
  );
};
