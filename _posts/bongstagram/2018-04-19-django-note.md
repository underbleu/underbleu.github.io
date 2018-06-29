# #1-39 Getting the User Feed

## #1. Feed View 생성 (홈화면)
```python
# images/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from . import models, serializers

class Feed(APIView):
    
    def get(self, request, format=True):
        
        # 현재 로그인한 유저를 확인
        user = request.user
        
        # 유저가 following한 모든사람
        following_users = user.following.all()
        
        image_list = []
        
        for following_user in following_users:
            
            # following한 사람이 올린 이미지 중 2개씩
            user_images = following_user.images.all()[:2]
            
            for image in user_images:
                
                # Image list에 담는다
                image_list.append(image)
                
        # Image list를 생성일이 오래된 순서로 sorting한다
        sorted_list = sorted(
            image_list, 
            key=lambda image: image.created_at, 
            reverse=True
        )
        
        # Serializing: python -> json
        serializer = serializers.ImageSerializer(sorted_list, many=True)
        
        return Response(serializer.data)
```

* `sorted(정렬할리스트, key=정렬기준)` [문서](https://www.pythoncentral.io/how-to-sort-a-list-tuple-or-object-with-sorted-in-python/)  
정렬해주는 python built-in function
* Lambda Functions으로 정렬기준을 더 깔끔히 넣어줄 수 있다
    * Typical function  
    ```python
    sorted_list = sorted(list, key=get_key)
    
    def get_key(image):
    return image.created_at
    ```
    * Lambda function [문서](http://www.secnetix.de/olli/Python/lambda_functions.hawk)  
    ```python
    sorted_list = sorted(list, key=lambda x: x.created_at)
    ```
---

## #2. FeedUserSerializer 생성
creator정보를 id로 표기하던 것에서 profile_image와 username으로 표기

## #3. like_count 생성
* **Backward relationship**  
    * ForeignKey로 Like가 Image를 참조할 수 있게하고
    * `related_name=likes`로 역으로 Image도 Like를 참조할 수 있게해줌
* **Model Field**  
    * DB에 저장
    * pertains to a column in the database
    * `file, location, caption`
* **Model Attribute `@`** 
    * DB에 저장 X
    * pertains to a method or property
    * `like_count`

```python
# images/model.py
class Image(TimeStampedModel):
    
    # --- Model Field ---
    file = models.ImageField()
    location = models.CharField(max_length=140)
    caption = models.TextField()
    
    # --- Model Attribute ---
    @property
    def like_count(self):
        return self.likes.all().count() # 'likes': Backward relationship from Like Model


class Like(TimeStampedModel):

    image = models.ForeignKey(
        Image, 
        related_name='likes', # 'likes': Backward relationship to Image Model
        null=True, 
        on_delete=models.PROTECT
    )
    
    ...
    
```
