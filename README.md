# nestjs-test

URL продакшн-версии: https://nestjs-test11.herokuapp.com/

## USER

- @GET /api/user - возвращает залогиненного пользователя и его теги. [Требует Авторизации]
- @PUT /api/user - {email?: string, password?: sting, nickname?: string} - обновляет данные залогиненного пользователя. [Требует Авторизации]
- @POST /api/tag - {name: string, sortOrder?: number} - создавет тег с текущим залогиненным юзером в поле создателя. Требует Авторизации.
- @DELETE /api/user - удаляет залогиненного пользователя. Требует Авторизации.

## AUTH

- @POST /api/signin - {email: string, password: sting, nickname: string} - регестрирует пользователя, возвращает токен для аутентификации и добавляет токен для обновления в cookie.
- @POST /api/login - {email: string, password: sting} - возвращает токен для аутентификации и добавляет токен для обновления в cookie.
- @GET /api/refresh - возвращает новый токен, если у пользователя есть токен для обновления в cookie.

## TAG

- @PUT /api/tag/:id - {name?: string, sortOrder?: number} - обновляет данные тега с указанным id. Требует Авторизации.
- @GET /api/tag/:id - возвращает тег с указанным id и данные о его создателе. Требует Авторизации.
- @DELETE /api/tag/:id - удаляет тег с указанным id. Требует Авторизации.

## USER-TAG

- @POST /api/user/tag - {tags: number[]} - добавляет несколько тегов в качестве юзер-тегов к залогиненному пользователю. Требует Авторизации.
- @GET /api/user/tag/my - возвращает все теги созданные залогиненным пользователем. Требует Авторизации.
  Write about 1-2 paragraphs describing the purpose of your project.
- @DELETE /api/user/tag/:id - удаляет юзер-тег с указанным id. Требует Авторизации.

## ДОПОЛНИТЕЛЬНЫЕ КОМАНДЫ

- npm run migration:generate - сгенерировать миграции.
- npm run migration:run - применить играции.
