import { type DataItem, DataTable } from "@/components/menuTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useEffect, useState } from "react";
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
import { GroupTable } from "@/components/groupTable";

export const MenuPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [auth, setAuth] = useState("true");
  const [menuList, setMenuList] = useState<DataItem[]>([]);
  const [groupList, setGroupList] = useState<DataItem[]>([]);
  const [order, setOrder] = useState(0);

  const [item, setItem] = useState<DataItem | null>(null);

  const handleEdit = (item: DataItem) => {
    setItem(item);
  };

  const handleClickEdit = async () => {
    const { data } = await axios.patch(
      `http://localhost:3000/menu/${item?.id}`,
      item,
      {
        withCredentials: true,
      }
    );
    if (data.owner) {
      setMenuList((prev) => {
        const index = prev.findIndex((menu) => menu.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    } else {
      setGroupList((prev) => {
        const index = prev.findIndex((menu) => menu.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    }
    setItem(null);
  };

  const handleDelete = async (item: DataItem) => {
    await axios.delete(`http://localhost:3000/menu/${item.id}`, {
      withCredentials: true,
    });
    if (item.owner) {
      setMenuList((prev) => prev.filter((menu) => menu.id !== item.id));
    } else {
      setGroupList((prev) => prev.filter((menu) => menu.id !== item.id));
    }
  };
  const handleCreateMenu = async () => {
    try {
      const canWrite = auth === "true";
      const { data } = await axios.post(
        "http://localhost:3000/menu",
        {
          name,
          description,
          owner: group,
          can_write: canWrite,
          order,
        },
        { withCredentials: true }
      );

      if (group) {
        setMenuList((prev) => [...prev, data]);
      } else {
        setGroupList((prev) => [...prev, data]);
      }
    } catch {
      alert("생성 실패");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/menu", { withCredentials: true })
      .then(({ data }: { data: DataItem[] }) => {
        if (data?.length) {
          setMenuList(data.filter(({ owner }) => owner));
          setGroupList(data.filter(({ owner }) => !owner));
        }
      })
      .catch((error) => {
        console.error("메뉴 데이터를 가져오는 중 오류 발생:", error);
      });
  }, []);
  return (
    <div className="p-6">
      <section>
        <div>생성</div>
        <div className="flex flex-col gap-3 p-4">
          <div>
            <Label>메뉴 이름</Label>
            <Input
              onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            ></Input>
          </div>
          <div>
            <Label>메뉴 설명</Label>
            <Input
              onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
            ></Input>
          </div>
          <div>
            <Label>그룹</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="그룹(상위 메뉴) 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {groupList.map(({ id, name }) => {
                    return (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>순서</Label>
            <Input
              type="number"
              value={order}
              onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                setOrder(Number(event.target.value));
              }}
            ></Input>
          </div>
          <div>
            <Label>권한</Label>
            <Select value={auth} onValueChange={setAuth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="권한 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">관리자</SelectItem>
                  <SelectItem value="false">뷰어</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="my-4" onClick={handleCreateMenu}>
            메뉴 생성
          </Button>
        </div>
      </section>
      <div>
        <div className="mb-4">그룹 목록</div>
        <GroupTable
          data={groupList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        ></GroupTable>
        <div className="mt-6 mb-4">메뉴 목록</div>
        <DataTable
          data={menuList}
          groupList={groupList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        ></DataTable>
      </div>
      {item && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-50/50 flex justify-center items-center">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>{item.owner ? "메뉴 수정" : "그룹 수정"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>이름</Label>
                <Input
                  value={item.name}
                  onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setItem((prev) => {
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
                <Label>설명</Label>
                <Input
                  value={item.description}
                  onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setItem((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          description: event.target.value,
                        };
                      }
                      return null;
                    });
                  }}
                ></Input>
              </div>
              {item.owner && (
                <div>
                  <Label>권한</Label>

                  <Select
                    value={`${item.can_write}`}
                    onValueChange={(event) =>
                      setItem((prev) => {
                        if (prev) {
                          return {
                            ...prev,
                            can_write: event === "true",
                          };
                        }
                        return null;
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="권한 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">관리자</SelectItem>
                        <SelectItem value="false">뷰어</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end items-end gap-4">
                <Button onClick={() => setItem(null)}>취소</Button>
                <Button onClick={handleClickEdit}>확인</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
