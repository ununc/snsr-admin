import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable, type IUserInfo } from "@/components/userTable";
import { makeDate } from "@/util/makeDate";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useEffect, useState } from "react";

const init = {
  id: "",
  password: "",
  name: "",
  email: null,
  phone: "",
  birth: "2000-01-01",
  sarang: "",
  daechung: true,
};

export const UserPage = () => {
  const [userList, setUserList] = useState<IUserInfo[]>([]);

  const [item, setItem] = useState<IUserInfo | null>(null);
  const [addPerson, setAddPerson] = useState(init);

  const handleEdit = (item: IUserInfo) => {
    setItem(item);
  };

  const handleDelete = async (item: IUserInfo) => {
    await axios.delete(`http://localhost:3000/auth/${item.pid}`, {
      withCredentials: true,
    });
    setUserList((prev) => prev.filter((user) => user.pid !== item.pid));
  };

  const createUser = async () => {
    try {
      if (!addPerson.email) {
        addPerson.email = null;
      }

      const { data } = await axios.post(
        "http://localhost:3000/auth/signUp",
        addPerson,
        { withCredentials: true }
      );
      setUserList((prev) => [...prev, data]);
      setAddPerson(init);
    } catch {
      alert("생성 실패");
    }
  };

  const editUser = async () => {
    const { data } = await axios.patch(
      "http://localhost:3000/auth/update-user-info",
      item,
      {
        withCredentials: true,
      }
    );
    setUserList((prev) => {
      const index = prev.findIndex((user) => user.pid === data.pid);
      prev[index] = data;
      return [...prev];
    });
    setItem(null);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth", { withCredentials: true })
      .then(({ data }: { data: IUserInfo[] }) => {
        if (data?.length) {
          setUserList(data);
        }
      })
      .catch((error) => {
        console.error("메뉴 데이터를 가져오는 중 오류 발생:", error);
      });
  }, []);

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddPerson((prev) => ({
        ...prev,
        [field]:
          field === "daechung" ? event.target.checked : event.target.value,
      }));
    };

  const handleEditChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setItem((prev) => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          [field]:
            field === "daechung" ? event.target.checked : event.target.value,
        };
      });
    };
  return (
    <div className="p-6">
      <div className="flex">
        <div className="w-1/2">
          <div>인원 추가</div>
          <div className="my-4 flex flex-wrap gap-4 w-96">
            <div>
              <Label>id</Label>
              <Input value={addPerson.id} onInput={handleChange("id")} />
            </div>
            <div>
              <Label>password</Label>
              <Input
                value={addPerson.password}
                onInput={handleChange("password")}
              />
            </div>
            <div>
              <Label>이름</Label>
              <Input value={addPerson.name} onInput={handleChange("name")} />
            </div>

            <div>
              <Label>이메일</Label>
              <Input value={addPerson.email} onInput={handleChange("email")} />
            </div>

            <div>
              <Label>핸드폰</Label>
              <Input value={addPerson.phone} onInput={handleChange("phone")} />
            </div>

            <div>
              <Label>생일</Label>
              <Input
                type="date"
                value={addPerson.birth}
                onInput={handleChange("birth")}
              />
            </div>

            <div>
              <Label>사랑방</Label>
              <Input
                value={addPerson.sarang}
                onInput={handleChange("sarang")}
              />
            </div>

            <div>
              <Label>대학부면 체크</Label>
              <Input
                type="checkbox"
                checked={addPerson.daechung}
                onChange={handleChange("daechung")}
              />
            </div>

            <Button onClick={createUser}>인원 생성</Button>
          </div>
        </div>
        {item?.pid && (
          <div className="w-1/2">
            <div>인원 수정</div>
            <div className="my-4 flex flex-wrap gap-4 w-96">
              <div>
                <Label>이름</Label>
                <Input value={item.name} onInput={handleEditChange("name")} />
              </div>
              <div>
                <Label>이메일</Label>
                <Input
                  value={item.email ?? ""}
                  onInput={handleEditChange("email")}
                />
              </div>
              <div>
                <Label>핸드폰</Label>
                <Input value={item.phone} onInput={handleEditChange("phone")} />
              </div>
              <div>
                <Label>생일</Label>
                <Input
                  type="date"
                  value={makeDate(item.birth)}
                  onInput={handleEditChange("birth")}
                />
              </div>
              <div>
                <Label>사랑방</Label>
                <Input
                  value={item.sarang}
                  onInput={handleEditChange("sarang")}
                />
              </div>
              <div>
                <Label>대학부면 체크</Label>
                <Input
                  type="checkbox"
                  checked={item.daechung}
                  onChange={handleEditChange("daechung")}
                />
              </div>
              <Button onClick={editUser}>수정하기</Button>
            </div>
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="my-3">등록 인원</div>
        <UserTable
          data={userList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        ></UserTable>
      </div>
    </div>
  );
};
