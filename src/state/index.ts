import { atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk";

export const userState = selector({
  key: "user",
  get: async () => {
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      return userInfo;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return {
        id: "",
        name: "Guest",
        avatar: "",
      };
    }
  },
});

export const matchesState = atom({
  key: "matches",
  default: [],
});
