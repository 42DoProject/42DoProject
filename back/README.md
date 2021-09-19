Readme.md
======
`Back 코드에서 신경써야 하는 부분이 있으면 계속 추가해주세요.`

### DB

DB model을 작성/추가할 때는 반드시 `src/models/` 안에 카테고리가 될 수 있는 폴더를 만들고, 그 안에 Model 하나 당 하나의 소스 파일을 사용해야합니다. 또한 파일 이름은 `(작성할 해당 Model).model.ts`의 형태여야 합니다.

파일명과 해당 파일 안에서 선언된 클래스명은 일치되어야 합니다. (ex. `user.model.ts`, `export class User extends Model {}`)

또한 테이블의 모든 메타데이터들은 모두 데코레이터로 작성되어야 합니다. (기존의 js sequelize 형식 X)

**다른 테이블을 포함하는 테이블은 모두 관계성을 가지고 있어야 합니다**

**ManyToMany는 사용하지 않고, ManyToOne 사이에 테이블을 만들어서 처리합니다**


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


### Utils

여러 파일에서 사용될 유틸적인 기능들은 module/ 폴더 내부에 (해당 기능 카테고리).ts 파일로 작성해주세요.
ex) ISO 시간을 반환하는 기능을 module/time.ts에 넣어놨습니다. 추후 time 관련 기능은 module/time.ts에 추가해주시면 됩니다.

## project API 명세
### GET
#### 프로젝트 list 
- url : `http://localhost:5000/project`
- request (query)
1. state : string, 프로젝트의 상태(`recruiting`, `proceeding`, `completed`)
2. page : number, 페이지
3. pageSize : number, 페이지당 카드 갯수
4. tag : string[], 기술스택을 가리키는 tag

- tag 테이블과 projecttag 테이블도 역시 project 테이블과 마찬가지로 임의의 데이터를 직접 넣어주셔야 합니다.
(https://velog.io/@du0928/42DoProject-개발일지 링크에 작성되어 있는 sql을 복붙하시면 쉽게 데이터 입력 가능)

- 요청은 querystring으로 보내주시면 됩니다.
(Ex : `http://localhost:5000/project?state=completed&page=1&pageSize=3&tag=react&tag=express`)

- post 기능이 추가되기 전까진 db 컨테이너에서 임의로 `projects` 테이블에 값을 넣으신 후, 테스트해주시면 됩니다.
(Ex : `INSERT INTO projects (title, totalMember, currentMember, state, like, createdAt, updatedAt) VALUE('42DoProject', 5, 5, 'proceeding', 200, NOW(), NOW());`)

#### 프로젝트 본문(content)과 프로젝트 팀원(profile) 조회
- url : `http://localhost:5000/project/content`
- method : `GET`
- request (query)
1. projectId : number, 프로젝트 id
- response
`{project: {content}, {projectprofile: {profile}}}`

#### 프로젝트 본문의 댓글(comments)과 댓글 작성자(profile) 조회
- url : `http://localhost:5000/project/comments`
- method : `GET`
- request (query)
1. projectId : number, 프로젝트 id
2. page : number, 페이지
3. pageSize : number, 페이지당 카드 갯수
- response
`{comments: {content}, {profile}}`

### POST
#### post 프로젝트 list
- url : `http://localhost:5000/project`
- request (body)
1. title : string, 프로젝트 제목
2. totalMember : number, 총 팀원 수
3. currentMember : number, 현재 팀원 수
4. state : string, 프로젝트 상태 ('recruiting', 'proceeding', 'completed')
5. tag : string[], 프로젝트 기술 태그

- 위 요청을 request.body를 통해 json 형태로 보내주시면 됩니다.
(Ex. `{"title":"42DoProject", "totalMember":"5", "currentMember":"5", "state":"proceeding", "tag":["react", "express"]}`)

- 위 예시의 요청은 project table에 알맞게 요청 값을 넣고, tag 테이블과의 관계를 설정하는 요청입니다. (tag 요청은 optional)

### DELETE
#### delete 프로젝트 list
- url : `http://localhost:5000/project`
- request (query)
1. projectId : number, project table의 id 값

- 요청은 querystring으로 보내주시면 됩니다.
(Ex : `http://localhost:5000/project?projectId=1`)

- 위 예시의 요청은 1번 id의 프로젝트 list를 삭제하는 요청입니다.
