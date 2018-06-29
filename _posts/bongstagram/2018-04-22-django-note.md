# #1-47 Get people to follow on :explore

>작업순서
>1. 시리얼라이저 생성
>2. view 생성
>3. 시리얼라이저를 사용하여 view가 url을 향하도록 해준다

## 1. 시리얼라이저 생성: ExploreUserSerializer
```python
# users/serializers.py
from rest_framework import serializers
from . import models

class ExploreUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.User
        fields = (
            'profile_image',
            'username',
            'name'
        )
```

## 2. view 생성: ExploreUser
```python
# users/views.py
from rest_framework import APIView
from rest_framework import Response
from rest_framework.status import status
from . import models, serializers

class ExploreUsers(APIView):
    
    def get(self, request, format=None):
        
        last_five = models.User.objects.all().order_by('-date_joined')[:5]
        
        serializer = serializers.ExploreUserSerializer(last_five, many=True)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
```

## 3. view가 url을 향하도록 해준다

```python
# users/urls.py
from django.conf.urls import url

from . import views

app_name = "users"
urlpatterns = [
    url(
        regex=r"^explore/$",
        view=views.ExploreUsers.as_view(),
        name="explore_users",
    ),
]
```

---

# #1-49 Following a User

>[Related objects reference](https://docs.djangoproject.com/en/1.11/ref/models/relations/)


1. OneToMany: Reporter - Article
2. ManyToMany: Pizza - Topping

ex1) `reporter.article_set.`에서만 method 사용가능
```python
class Reporter(models.Model):
    # ...
    pass

class Article(models.Model):
    reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE)
```

ex2) `topping.pizza_set` & `pizza.toppings.` 양쪽 모두에서 method 사용가능
```python
class Topping(models.Model):
    # ...
    pass

class Pizza(models.Model):
    toppings = models.ManyToManyField(Topping)
```

## # 좋아요/팔로우 기능
기능 | related manager | HTTP method |
--- | --- | --- |
Like | `.create()` | POST
Unlike | `.delete()` | DELETE
Follow | `.add()` | POST
Unfollow | `.remove()` | POST

