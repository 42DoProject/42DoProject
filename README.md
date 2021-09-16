# 42DoProject

*docker와 docker compose가 설치되어 있어야 합니다.*

```
$> ./docker-compose-up.sh
```
위 명령어로 컨테이너를 올립니다.

```
$> ./docker-compose-down.sh
```
위 명령어로 컨테이너를 종료합니다.

- back 서버가 실행될 때, tag table에 초기값을 넣는 기능을 추가하였습니다.
: tag에 넣고자 하는 값들을 `/back/.env` 파일에 환경변수로 선언해주시면 됩니다. (Ex. `TAG_LIST=react;express;typescript;mysql`)

## MySQL DB 접근 방법

1. 모든 컨테이너를 올립니다.
2. `docker exec -it 'db image id' sh` 명령어를 입력하면 db container 환경에서 sh이 실행됩니다. (image id는 `docker ps` 명령어로 확인 가능합니다.)
3. `mysql -u 'user name' -p` 명령어를 입력하여 MySQL 로그인을 시도합니다. (user name과 pw는 `/db/.env`에서 입력해주신 값을 활용하시면 됩니다.)
4. mysql이 실행되면 `show databases;` 명령어로 데이터베이스가 생성되었는지 확인합니다. (`/db/.env`에서 입력해주신 값을 이름으로 하여 데이터베이스가 생성됩니다.)
5. `use 'database name';` 명령어를 입력합니다.
6. `show tables;` 명령어로 projects 테이블이 생성되었는지 확인합니다.
7. 아래 명령어로 projects 테이블에 값을 저장할 수 있습니다.
```
INSERT INTO projects (`title`, `totalMember`, `currentMember`, `state`, `like`, `createdAt`, `updatedAt`) VALUE('42DoProject', 5, 5, 'proceeding', 42, NOW(), NOW());
```

- 참고사항 : db container가 초기화될 동안에는 back container에서 접근이 안되어 오류가 발생할 수 있고, login이 안될 수도 있습니다. 30초 정도 초기화 작업이 끝나면 정상화 됩니다.
