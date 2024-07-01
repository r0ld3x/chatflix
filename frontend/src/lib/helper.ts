import { faker } from "@faker-js/faker";

export function titleize(str: string) {
  let upper = true;
  let newStr = "";
  for (let i = 0, l = str.length; i < l; i++) {
    if (str[i] == " ") {
      upper = true;
      newStr += str[i];
      continue;
    }
    newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
    upper = false;
  }
  return newStr;
}

export const generateData = () => {
  const data = [];

  for (let i = 0; i < 20; i++) {
    const fake = faker.person;
    const name = fake.fullName();
    const avatar = faker.image.avatar();
    const lastMessage = faker.lorem.sentence();
    const time = faker.date.recent();
    data.push({ name, avatar, lastMessage, time });
  }
  return data;
};

export const getAccessToken = () => {
  return window.localStorage.getItem("access");
};
export const getRefreshToken = () => {
  return window.localStorage.getItem("refresh");
};
