let userUrl: string;
let emailUrl: string;
let folderUrl: string;

// чтобы можно было на локальной машине тестить
if (location.hostname === "localhost") {
  userUrl = `${location.protocol}//localhost:8081/api/v1/user`;
  emailUrl = `${location.protocol}//localhost:8082/api/v1/email`;
  folderUrl = `${location.protocol}//localhost:8083/api/v1/folder`;
} else {
  userUrl = `${location.protocol}//${location.hostname}/api/v1/user`;
  emailUrl = `${location.protocol}//${location.hostname}/api/v1/email`;
  folderUrl = `${location.protocol}//${location.hostname}/api/v1/folder`;
}

export const USER_URL: string = userUrl;
export const EMAIL_URL: string = emailUrl;
export const FOLDER_URL: string = folderUrl;

export const URLMINIO = `${location.protocol}//${location.hostname}/avatars`;
