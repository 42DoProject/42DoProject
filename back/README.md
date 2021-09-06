Readme.md
======
`Back 코드에서 신경써야 하는 부분이 있으면 계속 추가해주세요.`

### DB

DB model을 작성/추가할 때는 반드시 `src/models/` 안에 카테고리가 될 수 있는 폴더를 만들고, 그 안에 Model 하나 당 하나의 소스 파일을 사용해야합니다. 또한 파일 이름은 `(작성할 해당 Model).model.ts`의 형태여야 합니다.

또한 테이블의 모든 메타데이터들은 모두 데코레이터로 작성되어야 합니다. (기존의 js sequelize 형식 X)

**다른 테이블을 포함하는 테이블은 모두 관계성을 가지고 있어야 합니다**


### Interface

interface 폴더 내에 존재해야 하며, 파일 이름은 반드시 `(작성할 interface 이름).interface.ts`의 형태여야 합니다.
또한 직접 추가하거나 작성하는 interface 파일은 interface/~ 위치에 존재해야 하고, 기존의 @types 구조를 건드리는 경우에는 interface/@types/~ 위치에 존재해야 합니다.


### Routes

모든 routes는 routes/index.ts 파일에서 추가되어야 합니다.
main.ts에 직접적으로 추가하는 것은 cors와 같은 종속성이나 일부 특수한 미들웨어만 해당됩니다.

또한 새 라우트를 만드는 경우에는 `routes/(서비스 이름)/` 폴더를 만들어야하고, `routes/(서비스 이름)/(서비스 이름).controller.ts`와 `routes/(서비스 이름)/(서비스 이름).service.ts` 파일이 존재하여야 합니다.

`routes/(서비스 이름)/(서비스 이름).controller.ts` 내부에서는 해당 request 에 대해 service 로 연결해주는 역할만 담당합니다.
인증이 필요한 서비스의 경우 

```
router.get("/test", jwtGuards, (request: Request, response: Response) => {
    ...
```
위와 같은 형태로 jwtGuards를 추가해줄 수 있습니다.
