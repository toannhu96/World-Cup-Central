import { atom } from "recoil";
import { getUserInfo } from "zmp-sdk";

export const userState = atom({
  key: "user",
  default: getUserInfo({ autoRequestPermission: false })
    .then((res) => res.userInfo)
    .catch(() => ({
      id: "guest",
      name: "Guest",
      avatar: "",
    })),
});

export const matchesState = atom({
  key: "matches",
  default: [],
});
