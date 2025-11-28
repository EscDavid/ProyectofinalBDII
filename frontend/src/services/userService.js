import  {API}  from "./api";

export const userService = {
  login: (data) => API.post("/user/login", data),

  register: (data) => API.post("/user/register", data),

  getAll: () => API.get("/user"),
};
