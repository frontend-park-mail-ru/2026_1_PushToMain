// чтобы можно было на локальной машине тестить
let url: string;
if (location.hostname === "localhost") {
  url = `${location.protocol}//localhost:8080/api/v1`;
} else {
  url = `${location.protocol}//${location.hostname}/api/v1`;
}

export const URL: string = url;

export const URLMINIO = `${location.protocol}//${location.hostname}:9000/avatars`;
