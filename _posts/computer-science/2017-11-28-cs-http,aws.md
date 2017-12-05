---
layout: post
title: 컴퓨터공학_웹 HTTP, AWS
category: computer-science
permalink: /computer-science/:title/

tags: [HTTP, AWS]
comments: true
---
# HTTP (HyperText Transfer Protocol)
HTTP프로토콜을 이용해서 서버에 무엇인가를 요청할 때 사용하는 방식

정보를 유지하는 방법?

1. GET 방식-게시판   
우선 GET 방식은 요청하는 데이터가 HTTP Request Message의 Header 부분의 url에 담겨서 전송된다. 요청하는 데이터가 url의 '?'에 뒤에 붙어 전송된다. 전송할 수 있는 데이터 크기가 제한적이고 데이터가 url에 그대로 노출되므로 보안에 좋지 않다

2. POST 방식-로그인  
POST 방식의 request는 HTTP Message의 Body 부분에 데이터가 담겨서 전송된다. 데이터가 GET방식보다 크고 보안이 낫다

3. 쿠키 방식-
PC에 파일형태로 저장. 보안에 좋지 않음 
4. 세션 방식
서버의 메모리에서 사용자 정보를 관리하는것. "키:값"의 쌍으로 저장되어 있음. 보안이 된다. 페이지가 바뀌어도 로그인상태를 유지 시켜주는 방식

[Maria DB설치](https://downloads.mariadb.org/interstitial/mariadb-10.2.10/winx64-packages/mariadb-10.2.10-winx64.msi/from/http%3A//ftp.kaist.ac.kr/mariadb/)
>중요! Use UTF8를 꼭 체크해야함. default가 스웨덴어

-----

# AWS (Amazon Web Service)

### AWS의 서비스들
1. EC2(Elastic Compute Cloud)는 독립된 컴퓨터를 임대해주는 서비스
2. S3: 파일서버
3. RDS: 데이터베이스 서버
-> 이 서비스들을 조합해서 웹서비스를 만들게 된다

### AWS 설치
* 맥
```bash
$ chmod 400 aws.pem
```

* 윈도우 (Windows 7 기준)
aws가입 -> 모든서비스 -> EC2 -> 인스턴스 -> AMI(우분투) -> 프리티어 사용가능 선택 -> 다음 * 6 -> 시작 -> 새 키페어 생성 -> 디렉토리생성하여 aws.pem 옮겨놓기

### Putty 설치 / 설정
Linux 운영체제인 AWS에 PuTTY를 사용하여 Windows에서 Linux 인스턴스에 연결
1. putty.zip [다운로드](https://the.earth.li/~sgtatham/putty/latest/w64/putty.zip) 
2. aws.pem -> aws.ppk 파일로 변경
PUTTYGEN.EXE실행 -> conversions탭 -> import "aws.pem" -> Save private key -> aws.ppk 변환 완료
4. putty 설정
* putty.exe 실행 -> Host Name에 "ubunt@ + IPv4 퍼블릭 IP"입력   
* SSH > Auth 로 진입. Browse > 만들어뒀던 aws.ppk 불러오기
* Session에서 이름 입력후 Save -> Open (접속완료)


### NVM 설치
```bash
$ sudo apt-get update # 최신버전으로 업데이트 
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash # nvm설치
$ nano .bashrc # nano에디터 실행
$ source ~/.bashrc
$ nvm # nvm 실행
$ nvm install 8.9.1
$ npm i -g express-generator # express 기본틀 설치
$ mkdir projects
$ cd projects
$ express --ejs exp1
$ cd exp1
$ npm i
$ npm start
```

* aws 웹페이지 > 네트워크 및 보안 > 보안그룹 > 인바운드 포트number 22번만 열려있음 확인
* 인바운드 > 편집 > 규칙추가 > 원하는 port명(3000) 입력하여 사용

### pm2 모듈 설치
putty를 종료해도 서버가 항상 켜져있을 수 있게 해주는 모듈
```bash
$ cd exp1 
$ npm i -g pm2 # pm2모듈 설치
$ rm -r bin
$ nano app.js # 맨밑에 코드 추가후 저장
app.listen(3000);
console.log("Server started!");

$ pm2 start app.js # putty를 종료해도 서버가 항상 켜져있을 수 있음
$ pm2 stop app.js # 서버 끄기
```
