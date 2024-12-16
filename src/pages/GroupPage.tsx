import { DataItem } from "@/components/menuTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ZozicTable } from "@/components/zozicTable";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IUserInfo } from "@/components/userTable";

interface ZoZic {
  id?: string;
  name: string;
  user_pid_list: string[];
  menu_id_list: string[];
}

const init = (): ZoZic => {
  return {
    id: "",
    name: "",
    user_pid_list: [],
    menu_id_list: [],
  };
};

export const GroupPage = () => {
  const [newItem, setNewItem] = useState<ZoZic | null>(null);
  const [editItem, setEditItem] = useState<ZoZic | null>(null);
  const [groupList, setGroupList] = useState<ZoZic[]>([]);

  const [menuList, setMenuList] = useState<DataItem[]>([]);
  const [userList, setUserList] = useState<IUserInfo[]>([]);

  const handleEdit = (item: ZoZic) => {
    setEditItem(item);
  };
  const editZozic = async () => {
    if (!editItem) return;
    const id = editItem.id;
    delete editItem.id;
    const { data } = await axios.patch(
      `http://localhost:3000/group/${id}`,
      editItem,
      {
        withCredentials: true,
      }
    );
    setGroupList((prev) => {
      const index = prev.findIndex((zozic) => zozic.id === id);
      prev[index] = data;
      return [...prev];
    });
    setEditItem(null);
  };
  const handleDelete = async (item: ZoZic) => {
    await axios.delete(`http://localhost:3000/group/${item.id}`, {
      withCredentials: true,
    });
    setGroupList((prev) => prev.filter((group) => group.id !== item.id));
  };

  const handleClickCreate = async () => {
    try {
      if (!newItem) return;
      delete newItem.id;
      const { data } = await axios.post(
        "http://localhost:3000/group",
        newItem,
        { withCredentials: true }
      );
      setGroupList((prev) => [...prev, data]);
      setNewItem(null);
    } catch {
      alert("생성 실패");
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/group", { withCredentials: true })
      .then(({ data }: { data: ZoZic[] }) => {
        if (data?.length) {
          setGroupList(data);
        }
      })
      .catch((error) => {
        console.error("메뉴 데이터를 가져오는 중 오류 발생:", error);
      });

    axios
      .get("http://localhost:3000/menu", { withCredentials: true })
      .then(({ data }: { data: DataItem[] }) => {
        if (data?.length) {
          setMenuList(data);
        }
      })
      .catch((error) => {
        console.error("메뉴 데이터를 가져오는 중 오류 발생:", error);
      });

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

  return (
    <div className="p-6">
      <div className="w-full flex justify-start">
        <Button
          onClick={() => {
            setNewItem(init());
          }}
        >
          새로운 조직 생성
        </Button>
      </div>
      <div className="mt-6">
        <div>상세 사항</div>
        {editItem && (
          <div className="flex flex-col gap-3 p-4">
            <div>
              <Label>조직 이름</Label>
              <Input
                value={editItem?.name}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEditItem((prev) => {
                    if (prev) {
                      return {
                        ...prev,
                        name: event.target.value,
                      };
                    }
                    return null;
                  });
                }}
              ></Input>
            </div>
            <div>
              <Label>권한 리스트</Label>
              <div className="py-2">
                {editItem?.menu_id_list.map((menu_id) => {
                  const menu = menuList.find((menu) => menu.id === menu_id);
                  return (
                    <Badge className="mx-1" key={menu_id}>
                      {menu?.name}
                      {menu?.can_write ? "(관리자)" : "(뷰어)"}
                      <button
                        onClick={() => {
                          setEditItem((prev) => {
                            if (prev) {
                              return {
                                ...prev,
                                menu_id_list: editItem.menu_id_list.filter(
                                  (item) => item !== menu_id
                                ),
                              };
                            }
                            return null;
                          });
                        }}
                        className="ml-4 cursor-pointer"
                      >
                        X
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <Select
                  onValueChange={(event) => {
                    setEditItem((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          menu_id_list: [...prev.menu_id_list, event],
                        };
                      }
                      return null;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="권한 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {menuList
                        .filter(
                          (menu) => !editItem?.menu_id_list.includes(menu.id)
                        )
                        .map((menu) => {
                          return (
                            <SelectItem key={menu.id} value={menu.id}>
                              {menu.owner ? "" : "메뉴그룹 "}
                              {menu.name}
                              {menu.can_write ? "(관리자)" : "(뷰어)"}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>유저 리스트</Label>
              <div className="py-2">
                {editItem?.user_pid_list.map((user_id) => {
                  const user = userList.find((user) => user.pid === user_id);
                  return (
                    <Badge className="mx-1" key={user_id}>
                      {user?.name}
                      <button
                        onClick={() => {
                          setEditItem((prev) => {
                            if (prev) {
                              return {
                                ...prev,
                                user_pid_list: editItem.user_pid_list.filter(
                                  (item) => item !== user_id
                                ),
                              };
                            }
                            return null;
                          });
                        }}
                        className="ml-4 cursor-pointer"
                      >
                        X
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <Select
                  onValueChange={(event) => {
                    setEditItem((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          user_pid_list: [...prev.user_pid_list, event],
                        };
                      }
                      return null;
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="유저 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {userList
                        .filter(
                          (user) => !editItem?.user_pid_list.includes(user.pid)
                        )
                        .map((user) => {
                          return (
                            <SelectItem key={user.pid} value={user.pid}>
                              {user.name}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setEditItem(null);
                }}
              >
                취소
              </Button>
              <Button onClick={editZozic}>저장</Button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div>조직 리스트</div>
        <ZozicTable
          data={groupList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          menuList={menuList}
          userList={userList}
        ></ZozicTable>
      </div>

      {newItem && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-50/50 flex justify-center items-center">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>새 조직 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>이름</Label>
                <Input
                  value={newItem.name}
                  onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewItem((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          name: event.target.value,
                        };
                      }
                      return null;
                    });
                  }}
                ></Input>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end items-end gap-4">
                <Button onClick={() => setNewItem(null)}>취소</Button>
                <Button onClick={handleClickCreate}>확인</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
