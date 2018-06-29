# # 1-29 Django Rest Framework

## REST Framework
> [공식문서](http://www.django-rest-framework.org/)

Web API를 만들기 위한 강력한 툴킷. 많은 종류의 class, funtion, python패키지를 가지고 있다. 

* 장고가 가지고 있는 기본객체들의 확장판이라고 볼 수 있다  
(확장판일뿐, 두개는 다른 것이다!!!)

    장고기본 Web API | REST Framework
    --- | ---
    `HttpRequest` | `Request` 
    `HttpReponse` | `Response`
    `View` | `APIView`

## 설치
1. `$ pipenv install djangorestframework`  
2. 설치후 THIRD_PARTY_APPS에 추가
    ```python 
    # config/settings/base.py

    THIRD_PARTY_APPS = [
        'allauth',
        'allauth.account',
        'allauth.socialaccount',
        'rest_framework', # 추가
    ]
    ```

## 기능
* Web browsable API
* Authentication policies (OAuth1, OAuth2)
* Serializer  
장고월드(파이썬)와 리액트월드(자바스크립트)를 연결하는 다리.
    * 파이썬 <-> json 오브젝트를 변환시켜준다.
    * 백엔드 Django: 파이썬 오브젝트 (Respond)
    * 프론트엔드 React: json 오브젝트 (Request)

---

# #1-30~32 Image Serializers, View, Url

>작업순서
>1. 시리얼라이저 생성
>2. view 생성
>3. view가 url을 향하도록 해준다

## 1. 시리얼라이저 생성

```python
# images/serializers.py

from rest_framework import serializers
from . import models

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Image
        fields = '__all__'
```

## 2. View 생성
>[공식문서](http://www.django-rest-framework.org/api-guide/views/) 

### # `APIView` (class-based views)
Django의 `View`클래스의 확장판. 기능은 비슷하다.
* 다른점
    * `HttpRequest`가 아닌 `Request`를 받아 요청에 따른 메소드를 실행하여 화면을 그린다 
    * `HttpResponse`가 아닌 `Response`를 반환한다
    * `APIException`이 예외상황들을 캐치하여 적절한 대응을 해준다
    * request를 받아 메소드를 수행하기 이전에 인증/인가받는 유저를 확인한다
* `get(self, request, format=None)`
    1. self. 인자아님
    2. `request`  
    첫번쨰 인자로 `Request`인스턴스를 받는다 (이름을 다르게써도 무조건 reqest인스턴스가 첫번쨰 인자로 들어감)
    3. `format=None`  
    기본은 json (xml등 다양한 포맷설정가능)


*(아래) 테스트용으로 작성. 실제로는 사용하지 않을 코드*
```python
# images/views.py
from rest_framework.views from APIView
from rest_framework.response import response
from . import models, serializers

class ListAllImages(APIView):

    def get(self, request, format=None):
        
        # DB에 있는 모든 이미지 가져오기
        all_images = models.Image.objects.all()
        
        # python -> json 변환후, serializer.data에 저장
        serializer = serializers.ImageSerializer(all_images, many=True)
        
        # 변환된 json 오브젝트를 return
        return Response(data=serializer.data)
```

* Model클래스의 QuerySet [문서](https://docs.djangoproject.com/en/2.0/ref/models/querysets/)  
    * 문법: `Model.objects.all()`  
    * 유용한 메서드: `filter() order_by() value() all()`...
* `many=True` flag  
ImageSerializer에게 여러개의 이미지를 변환하도록 명령

## 3. view가 url을 향하도록 해준다

### #1. Mapping URL
>URL patterns (regex) <-- 매칭 --> View (Python functions)

1. images/all 경로로 접근하면  
`regex=r"^all/$"`  
2. ListAllImages를 `as_view()`로 설정하여 보여줘라  
`view=views.ListAllImages.as_view()`  

```python
# images/urls.py
from django.conf.urls import url 
from . import views

urlpatterns = [
    # 1. django.conf.urls.url() 인스턴스 로드
    url(
        # 2. Run through each URL pattern
        regex=r"^all/$",
        # 3. If regex matches, Django imports View
        view=views.ListAllImages.as_view(),
        name="all_images"
    )
]
```

### #2. Import URL
장고가 생성한 images의 url을 찾을 수 있도록 통합 url.py에서 불러와준다
```python
# config/urls.py

urlpatterns = [
    # User management
    url(r"^users/", include("bongstagram.users.urls", namespace="users")),
    url(r"^images/", include("bongstagram.images.urls", namespace="images")), # import !
    url(r"^accounts/", include("allauth.urls")),
]
```

-> 123.0.0.1:8000/images/all에서 모든 이미지DB들이 json객체로 불러와지는 것을 확인할 수 있음 !