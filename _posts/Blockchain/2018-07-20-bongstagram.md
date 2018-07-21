---
layout: post
title: Bongstagram DApp 개발
category: Blockchain
permalink: /Blockchain/:title/

tags: [Blockchain]
comments: true
---

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/277637707" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>


## Ethereum ERC721-based photo licensing DApp

봉스타그램은 ERC721스펙 기반의 사진 라이센싱 어플리케이션입니다.  
이 DApp을 만든 목적은 각각의 고유한 가치를 가진 사진을 토큰화하고, 블록체인에 기록함으로써 
크리에이터들이 자신의 작품에 대한 소유권을 지키는데에 도움을 주기 위해서 입니다

## Bongstagram Architecture
![봉스타그램 아키텍처]({{site.baseurl}}/img/bongstagram-architecture.png)

봉스타그램의 주요 컨트랙트 함수로는 mint와 transfer가 있습니다. 이에 따른 두가지 User Scenario가 있습니다 
1. 사진을 업로드하며, 사진을 ERC721 토큰화 하는 scene
2. 토큰의 소유권을 이전하는 scene

### # Scenario.01

① 오른쪽 하단의 "사진 업로드 버튼"을 누르면 업로드 창이 뜹니다
* 사진파일을 선택하고, location과 caption을 입력합니다
* 트랜잭션을 보내기위한 Gas Price를 설정합니다

② Upload 버튼을 누르면, 사진이 서버에 저장되고

③ 저장된 이미지의 "imageId와 photoURL"을 인자로 받아 mint 함수가 실행됩니다

④ mint함수의 콜백에서 "imageId와 txHash"를 받아 해당이미지의 DB에 저장합니다. 이 때, txHash를 DB에 저장하는 이유는  
* 트랜잭션이 블록에 담기기 전까지 상태 추적하여 유저에게 피드백 주기 위해서
* 유저에게 트랜잭션을 직접 etherScan에서 조회할 수 있는 링크를 제공해주기 위해서 입니다

⑤ 트랜젝션이 Ethereum Network의 pool에 담깁니다. 이 때 트랜잭션의 gas price가 적절히 설정되어 있었다면 곧 블록에 담기게 됩니다
* 가스비가 적게 설정되 pending상태가 지속되는 트랜잭션이 있을 수 있기 때문에
* 서버에 이미지 업로드시 자동으로 생성되는 imageId는 tokenId보다 같거나 큽니다

⑥ 트랜잭션이 블록에 담기게 되면, mint함수에 내장되어있던 GenerateToken 이벤트가 발생하게 됩니다. 이 때, 블록체인을 subscribe하고 있던 웹소켓이 이벤트를 감지하고
* 이벤트의 returnValue인 photoToken(_tokenId)를 DB에 저장합니다

⑦ 저장된 photoToken은 이미지 오른쪽 상단의 "copyright mark ⓒ" hover시
* 컨트랙트의 getCopyright 함수를 호출하는 인자로 사용되어
* Copyright.No, issuedate, owner의 EA등의 저작권 정보를 가져올 수 있게 해줍니다


### # Scenario.02
봉스타그램에서는 ERC721스펙을 사용하기 때문에 transfer라는 토큰 소유권을 이전하는 함수를 사용할 수 있었습니다

① 현재 로그인한 유저가 소유한 사진에만 종이비행기 모양의 버튼이 렌더링 됩니다.
버튼을 누르면 transfer창이 뜹니다
* FROM에는 현재 로그인한 유저의 지갑주소가 입력되있고
* TO에는 사진의 소유권을 이전할 다른 유저의 지갑주소를 입력합니다
* gas price를 적절히 설정하고, Transfer 버튼을 누르면

② 컨트랙트의 Transfer함수가 실행됩니다

③ 사진 업로드와 마찬가지로 Transfer 함수의 콜백에서 "imageId와 txHash"를 받아 해당이미지의 DB에 업데이트합니다

④ 트랜잭션이 블록에 담기면, 웹소켓이 이벤트를 감지하여

⑤ returnValue인 새로운 owner의 지갑주소를 해당이미지의 DB에 업데이트하고

⑥ 사진의 소유권이 성공적으로 이전되었음을 알리는 alert창이 뜹니다

---

## # Digital-media에 대한 소유권 보호를 위한 고민

>자산의 핵심은 수명이다. 자산의 가치가 길어지고 가치의 위조가 불가능할 수록 더 바람직하다  
>-블록체인과 세상 모든 것의 미래. 트루스머신 中-

### # 어떻게 저작권보호에 효력이 생기는지 ?
블록체인에 작품을 Time-stamping 함으로써, Creator이 자신의 작품에대한 소유권을 주장하는데에 효력이 생긴다. 하지만 더 확실한 법적보호를 받기위해서는 USCO(미국의 저작권청)같은 곳에 비용을 지불하고 저작권을 등록하는게 좋다

#### # YZAB의 이재창 디자이너의 디자인권 분쟁 사례

>(출처) 특허청 디자인가이드북 25p

디자인출원 전 '마이홈' 책상디자인을 개인홈페이지와, 네이버 블로그에 처음 공개했다. 
* 네이버 **블로그**에는 '공지일자, 공지주체, 공지형태`가 모두 나타나 증명서류로 인정받을 수 있었다
* 만일 디자인을 **개인홈페이지**에만 공개했다면, '공지일자' 증명서류로 인정받기 어려웠을 수도 있다

### #  Solidity를 통한 토큰 컨트랙트 개발시, ERC721스펙을 사용한 이유?
크립토좀비를 통해 첫 ERC-721토큰을 발행해보았다. 단순히 거래소에서 사용하던 fungible한 화폐토큰이 아닌, **제 각각의 고유한 가치(non-fungible)**를 가지고 있는 토큰이라는 점에서 흥미로웠다. 이전에 아트 플랫폼 서비스를 만들던 창업팀에서 플랫폼에 창작물을 게시함으로써 해당 창작물에 대한 소유권을 보호해주기 위한 방법들을 고민해보았었는데, 그에 대한 좋은 답을 찾은것 같았다. 이 때 얻은 아이디어로 ERC721스펙 기반의 포토 라이센스 DApp인 봉스타그램을 만들었다


### # DB 위변조의 가능성에 대한 대안
현재 Bongstagram DApp에서 사진토큰을 생성하기 위해 서버에 저장된 photoURL을 사용하고 있다. 이는 Bongstagram이라는 서비스가 중앙집권적으로 생성한 URL이라는 점에서 블록체인을 사용하는 의미를 떨어트리고, 만일 Bongstagram의 서버가 날라갔을시 트랜잭션 data에 담긴 photoURL이 특정이미지를 가르킨다는 것을 입증할 방법이 없어진다.

이런 문제점들을 해결하기 위한 방법들을 고민해보고 있고, 지금까지 생각해본 방법은 두가지가 있다.

#### 1. base64 인코딩
이미지자체를 base64로 인코딩하여 트랜잭션 data에 실어보내면 어떨까 ?  
* 3MB의 이미지가 5MB 크기로 커진다. 가스비문제 때문에 현실가능성 없는 대안

#### 2. 이미지 hashing
이미지를 hashing한 값을 토큰생성시 트랜잭션 data에 실어보내면 어떨까 ?

* DApp에서 getCopyrightInfo등의 함수를 호출할 때, 서버에 저장된 사진을 hashing한 값과 대조하여 사진의 진위여부를 따져볼 수 있다. 이렇게 하면 서버에서 자체적으로 생성한 photoURL에 의존하지 않고, 사진자체의 hashing값으로 진위여부를 따지게 되므로 블록체인의 본질인 '탈중앙화'를 흐리지 않을 수 있을 것 같다

* Bongstagram 서버가 날라가도 원작자는 사진의 원본을 가지고 있을 것. 이를 hashing하여 트랜잭션 data에 있는 이미지 hashing값과 대조해볼 수 있다

* 날짜, 카메라기종 세팅등의 메타데이터를 담은 exif까지 함께 해싱되기 때문에 더 많은 정보의 단서를 트랜잭션에 담을 수 있다  

* 사진을 해싱한 값을 활용하면, 사진으로 저작권 정보를 검색한다던가 복제본을 찾아내는 기능을 빠르게 수행할 수 있을 것이다  


### # ERC721-based 토큰 발행하는 가스비. 현실적인 벽 어떻게 생각하는가?
블록체인에 작품들의 기록을 남겨, 무료로 크리에이터들의 digital-media에 대한 소유권 보호를 돕는 Binded라는 copyright platform이 있다. Binded는 트랙젝션 비용을 절감하기위해, ERC-20 토큰에 들어온 모든 저작권등록정보를 넣어 발행한다. 하루에 최대 5$ 비용이 든다. 이런 방식을 참고하여 더 생각해봐야 할 것 같다...

> 봉스타그램 DApp을 만들며 작성한 [개발일지](http://underbleu.com/Bongstagram/)