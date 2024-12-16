import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const BaseLayout = () => {
  const navigate = useNavigate();

  const handleValueChange = (value: string) => {
    navigate(value);
  };
  const location = useLocation();
  return (
    <div>
      <div>
        <RadioGroup
          defaultValue={location.pathname.replace("/", "")}
          className="flex p-4"
          onValueChange={handleValueChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="menu" id="menus" />
            <Label htmlFor="menus">메뉴 설정</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="group" id="groups" />
            <Label htmlFor="groups">조직 설정</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="users" />
            <Label htmlFor="users">유저 설정</Label>
          </div>
        </RadioGroup>
      </div>

      <Outlet />
    </div>
  );
};
