1. PUT /emails/{emailId}/folder

    Важное замечание, входящие и отправленные это тоже папки, поэтому в БД так и стоит их хранить в поле folder

    Передаются куки с SCRF и SESSION + query emailId

    Сценарий спам: все письма пользователя от sender_email должны автоматичеки получить folder spam

        {
            "folder": "spam"
        }

    Сценарий избранное: письмо должно появляться в списках избранного и входящего

        {
            "folder": "favorite"
        }

    Сценарий кастомных папок: всего пользователь сможет добавить макс. 3 папки, соответственно они будут иметь фиксированный тег folder-1, folder-2, folder-3

    {
        "folder": "folder-1"
    }

    Сценарий корзина: письмо попадает в папку коризна и только тогда пользователь может его удалить, т.е без метки trash В БД DELETE не работает!

    {
        "folder": "trash"
    }

2. GET /emails/search

    Передаются куки с SCRF и SESSION 

    body {
        search
    }

    response {
        email: {
            id,
            body,
            header,
            created_at,
            is_read,
            folder,
        }
    }

3. PUT /profile/change

    Надо доделать поля!!!

    Передаются куки с SCRF и SESSION 

    body {
        name
        surname
        birthday
        gender
    }

4. POST /emails/send/{emailId}/file

    Передаются куки с SCRF и SESSION 


    Сохранение файла письма (вложение)

    body {
        file
    }

5. PUT /emails/folder/change

    Передаются куки с SCRF и SESSION 

    Создание кастомных папок, всего можно создать до 3 штук folder-1, folder-2, folder-3

    Сценарий:

    body {
        name
        tag: "folder-1"
    }

6. GET /profile/me

    Передаются куки с SCRF и SESSION 

    Получение списка кастомных засунуть в /me

    body {
        email
        id
        image_path
        name
        surname
        folder: []
    }


