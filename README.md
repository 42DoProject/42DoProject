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




# 실제 서버에 배포 (front/back)

front와 back을 각각 따로 배포할 수 있습니다.

deploy-* 이름을 가진 브랜치에 머지되면 자동적으로 배포를 진행합니다.

![1](https://user-images.githubusercontent.com/12230655/139650465-b5a2e63a-a5d0-403b-985d-83b0cea10467.png)


![2-1](https://user-images.githubusercontent.com/12230655/139650661-a2493421-ef38-45e5-b825-d793102a48b6.png)
▲ 프론트의 경우

![2-2](https://user-images.githubusercontent.com/12230655/139650518-dad4573e-06f1-47d6-a037-2f9cc6925673.png)
▲ 백의 경우

이후 PR이 올바르게 merge 되면, 배포를 진행합니다.





배포 브랜치는 main -> deploy-(배포 대상) 으로 merge 되어야 하며, 프론트 배포 사항을 deploy-backend 에 merge 할 경우 프론트는 배포되지 않습니다



![3](https://user-images.githubusercontent.com/12230655/139664842-c35d5d6d-8c8e-495f-a24c-c02dc576acee.PNG)
배포 이후 이 알림은 무시해주시면 됩니다

