클래스 vs 함수

클래스 | 함수
--- | ---
new연산자와 함께 호출 (필수)
선언 후 호출가능 | 선언전 호출 가능 (호이스팅)

---

# #1-58 ~ 60 Creating Notification

1. 설치  
`$ django-admin startapp notifications`
2. 앱에 추가  
```python
# notifications/apps.py
from django.apps import AppConfig

class NotificationsConfig(AppConfig):
    name = 'bongstagram.notifications'

# config/settings/base.py
LOCAL_APPS = [
    'bongstagram.users.apps.UsersConfig',
    # Your stuff: custom apps go here
    'bongstagram.images.apps.ImagesConfig', # images app
    'bongstagram.notifications.apps.NotificationsConfig', # notifications app
]
```

## #1. 모델생성
like, follow, comment 알림
1. 날짜 생성위해 TimestampedModel을 확장하여 만든다
2. TYPE_CHOICE의 1번째는 모델, 2번쨰는 admin패널을 위한 항목 [Model Field](https://docs.djangoproject.com/en/2.0/ref/models/fields/)
3. image항목은 follow알림에 필수X
    * `Field.blank`: 필수 항목 여부
    * `Field.null`: 빈값 허용 여부 (no data. empty string)  
    -> **null** is database-related, whereas **blank** is validation-related
4. comment 댓글요약. Like와 Follow에선 필수X
5. 마이그레이션!  
`$ python manage.py makemigrations && python manage.py migrate`

```python
# notifications/models.py
class Notification(image_models.TimeStampedModel): #1.
    
    TYPE_CHOICES = (
        ('like', 'Like'), #2. for Model, for User-read
        ('comment', 'Comment'),
        ('follow', 'Follow')
    )
    
    creator = models.ForeignKey(
        user_models.User, 
        related_name='creator', # Backward-relationship to User
        on_delete=models.PROTECT # Django 2.0 required
    )
    to = models.ForeignKey(
        user_models.User, # Backward-relationship to User
        related_name='to',
        on_delete=models.PROTECT # Django 2.0 required
    )
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES
    )
    image = models.ForeignKey(
        image_models.Image,
        null=True, blank=True, #3. not requeired
        on_delete=models.PROTECT # Django 2.0 required
    )
    comment = models.TextField(
        null=True, blank=True #4. not requeired
    ) 
```

## #2. 시리얼라이저 생성

```python
# notification/serializers.py
from rest_framework import serializers
from . import models
from bongstagram.users import models as user_models
from bongstagram.images import models as image_models

class NotificationSerializer(serializers.ModelSerializer):
    
    creator = user_serializers.ListUserSerializer()
    image = image_serializers.SmallImageSerializer()
    
    class Meta:
        model = models.Notification
        field = '__all__'
```
## #3. view 생성

```python
# notifications/views.py
from rest_framework.views import APIView
from rest_framework.status import status
from rest_framework import Response
from . import models, serializers

class Notifications(APIView):
    
    def get(self, request, format=None):
        
        user = request.user
        
        # 현재 로그인한 user에게 온(to) Notification
        notifications = models.Notification.objects.filter(to=user)
        
        serializer = serializers.NotificationSerializer(notifications, many=True)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
```

## #4. url 연결

```python
# notifications/urls.py
from django.cong.urls import url
from . import views

app_name = "notifications"
urlpatterns = [
    url(
        regex=r"^$",
        view=views.Notifications.as_view(),
        name="notifications"
    ),
]
```

---
# #1-60 Creating Notification whenever people Follow, Comment and Like 

## #1. follow, comment, like할때 마다 자동으로 Notifiaction생성
* view 생성하지 않고, function를 만든다
(공개적인 view 생성하면 내알림설정에 외부인이 들어올 수 있음)

1. create_notification 함수 생섬
```python
# notifications/views.py

# ...

def create_notification(creator, to, notification_type, image=None, comment=None):
  
    notification = models.Notification.objects.create(
      creator=creator,
      to=to,
      notification_type=notification_type,
      image=image,
      comment=comment
    )
    
    notification.save()
```

2. follow notification
```python
# users/views.py
from bongstagram.notifications import views as notification_view

class FollowUser(APIView):
    
    def get(self, request, format=None):
      
      #...
      user.following.add(user_to_follow)
      
      user.save()
      
      # Create notification for follow
      notification_views.create_notification(user, user_to_follow, 'follow')
```

3. like, comment notification

```python
# images/views.py
from bongstagram.notifications import views as notification_views

class LikeImage(APIView):
    
    def post(self, request, image_id, format=None):
        # ...
        
        new_like = models.Like.objects.create(creator=user, image=found_image)
        
        new_like.save()
        
        # Create notification for like
        notification_views.create_notification(
            user,
            found_image.creator,
            'like',
            found_image
        )
        
        return Response(status=status.HTTP_201_CREATEd)

    # ...
    
    class CommentOnImage(APIView):
        
        def post(self, request, image_id, format=None):
          
            # ...
            
            serializer = serializers.CommentSerializer(data=request.data)
            
            if serializer.is_valid()
                
                serializer.save(creator=user, image=found_image)
                
                # Create notification for comment
                notification_views.create_notification(
                    user,
                    found_image.creator,
                    'comment',
                    found_image,
                    serializer.data['message']
                )
```

4. notification 정렬
    * created 순으로 
    * __str__: string representation. 텍스트를 어떻게 보이게할 지 설정하는 메소드
```python
# notifications/models.py
from bongstagram.images import models as image_models

class Notification(image_models.TimeStampedModel):
    
    # ...
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return 'From: {} - To: {}'.format(self.creator, self.to)
```