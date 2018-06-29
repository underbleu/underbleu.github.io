# #1-54 Class Based Views vs. Function Based Views

## Class-based vs Function-based View
[나는 왜 class-based views를 사용하지 않는가](https://simpleisbetterthancomplex.com/article/2017/03/21/class-based-views-vs-function-based-views.html)

* 클래스 역시 함수이다.  
"View.as_view() class method, it returns a function"
* class-based views가 function-based views를 대체할 수는 없다
* function-base views은 가독성이 좋고 decorator를 사용하기 간단하다. 하지만 code를 extend하거나 재사용하기 힘들다.
* 그럼 각각 언제 사용해야하는가?
    * 단순히 어떤 리스트를 나열하는데 하위항목으로 사용할땐 class-based
    * 복잡한 operation과 여러 form을 한번에 다뤄야할 땐 function-based를 사용하라

>우리 프로젝트에서는 CBV(Class-Based View)를 주로 사용한다
>* 심플하고 쉽게 코드를 작성하기 위해
>* REST_framework의 기능을 사용하기위해

### #ex1. function-based views로 짰을때
```python
# urls.py
urlpatterns = [
  
    # ...
    url(
        regex=r'^(?P<username>\w+)/following/$',
        view=views.UserFollowingFBV(),
        name='user_following',
    ),
]

# views.py
def UserFollowingFBV(request, username):
    
    if request.method == 'GET':
        try:
            found_user = models.User.objects.get(username=username)
        except models.User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user_following = found_user.following.all()
        
        serializer = serializers.ListUserSerializer(user_following, many=True)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
```
### #ex2. class-based views로 짰을때
```python
# urls.py
urlpatterns = [
  
    # ...
    url(
        regex=r'^(?P<username>\w+)/following/$',
        view=views.UserFollowing.as_view(),
        name='user_following',
    ),
]

# views.py
class UserFollowing(APIView):
    
    def get(self, request, username, format=None):
        
        try:
            found_user = models.User.objects.get(username=username)
        except models.User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        user_following = found_user.following.all()
        
        serializer = serializers.ListUserSerializer(user_following, many=True)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
```

---
# #1-55 Searching Images by Hashtag

## # taggit 설치
태그 검색을 쉽게해주는 라이브러리 [Django Taggit Documentation](https://django-taggit.readthedocs.io/en/latest/)
1. 설치  
`$ pipenv install django-taggit`
2. 앱에 추가 & 대소문자 구분하도록 설정
```python
# config/settings/base.py
THIRD_PARTY_APPS = [
    # ...
    'rest_framework', # REST framework
    'taggit', # Tags for the photos
]

# (code 맨뒤) Tag 대소문자 구분 설정
TAGGIT_CASE_INSENSITIVE = True
```
3. 마이그레이션 ! (makemigration은 field추가할때)
`$ python manage.py migrate`
4. 모듈에서 import하여 사용  
```python
# images/models.py
from taggit.managers import TaggableManager

class Image(TimeStampedModel):

    """ Image Model """

    # ...
    
    tags = TaggableManager() # 추가 !!
    
    # ...
```

---

## filter

```
# Image 모델 예시
title: 'hello',
location: 'seoul',
creator: (
  User: id:1, username: 'bong'
)
tags: (
  name: 'girl', 'dev'
)
```
```python
# images/views.py
models.Image.objects.filter(location=seoul)
models.Image.objects.filter(creator__username="bong")
models.Image.objects.filter(creator__username__contains="bo")
models.Image.objects.filter(creator__username__icontains="Bo")
models.Image.objects.filter(creator__username__iexact="Bong")
models.Image.objects.filter(tags__in=[arr1, arr2, arr3])
```
* `.distinct()` 중복 데이터 제거

## url 순서
* `'^search/$'` URL이 먼저와야한다 
* `'^(?P<username>\w+)/$'` URL이 먼저오면 search자체를 username중의 하나로 인식해서 UserProfile 뷰가 보이게 된다
```python
# users/urls.py
urlpatterns = [
  
    # ...
    url(
        regex=r'^search/$',
        view=views.Search.as_view(),
        name='search'
    ),
    url(
        regex=r'^(?P<username>\w+)/$',
        view=views.UserProfile.as_view(),
        name='user_profile',
    ),
```