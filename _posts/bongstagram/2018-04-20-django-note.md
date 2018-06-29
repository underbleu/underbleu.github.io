# #1-41 Using Variables on the URLS

>`image/3/like` URL로 접근하기
>1. Create `LikeImage` View & URL
>2. Take the ID from the URL
>3. Find image with the ID
>4. Create like for the image

## #1. Create the URL and the View

## #2. URL Dispatcher _ Take the ID from the URL
[Capturing arguments on Django URL's](https://docs.djangoproject.com/en/1.11/topics/http/urls/#named-groups)  
1. regex로 작성된 URL은 인자로 전달되어
2. View에서 불러올 수 있다

```python
# images/urls.py
urlpatterns = [
    url(
        #1. Pass "image_id" keyword arguments
        regex=r"(?P<image_id>\w+)/like", 
        view=views.LikeImage.as_view(),
        name="like_image"
    )
]

# images/views.py
class LikeImage(APIView):
    
    def get(self, request, image_id, format=None):
        
        print(image_id) #2. Capture URL
        
        return Response(status=200)
```
* URLConf 정규표현식 매핑
    * `(?P)` : 이 영역의 문자열에 정규표현식을 적용해서
    * `\w+` : \w+ 패턴에 부합된다면
    * `<image_id>` : image_id 라는 변수명으로 인자를 `view.LikeImage`로 넘기겠다.

>[정규표현식 학습](https://regexone.com/)  
>[Test Regular Expressions](https?P<username>\w+://regex101.com/)

---

# #1-43 ~ 44 Like / Ulike

1. image_id로 이미지를 찾아온다
2. 해당 이미지가 없으면 -> 404
3. 이미 좋아요가 눌러져 있으면 unlike -> 204 
4. 없으면 좋아요를 생성한다 -> 201

```python
# images/views.py
from rest_framework import status

class LikeImage(APIView):
    
    def get(self, request, image_id, format=None):
        
        user = request.user
        
        # 1. image_id로 이미지를 찾아온다
        try:
            found_image = models.Image.objects.get(id=image_id)
            
        # 2. 해당 이미지가 없으면 -> 404
        except models.Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 3. 이미 좋아요가 눌러져 있으면 unlike -> 204 
        try: 
            preexisting_like = models.Like.objects.get(
                creator=user,
                image=found_image
            )
            preexisting_like.delete() # Unlike
            
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        # 4. 없으면 좋아요를 생성한다 -> 201
        except models.Like.DoesNotExist:
            new_like = models.Like.objects.create(
                creator=user,
                image=found_image
            )
            new_like.save() # Like
            
            return Response(status=status.HTTP_201_CREATED)
```

* REST framework - Status Code [문서](http://www.django-rest-framework.org/api-guide/status-codes/)  
REST framework includes a set of named constants that you can use to make your code more obvious and readable

---

# #1-45 Commenting on an Image 사진에 댓글달기

1. 댓글을 작성할 URL & View 생성  
`images/image_id/comment` URL로 접근했을때, 댓글을 작성할 CommentOnImage view를 보여준다
2. URL의 "image_id"에 해당하는 이미지가 있는지 확인  
    * 해당이미지가 없다면 -> 404
3. POST request로 받아온 message를 시리얼라이징 (json -> python)  
post request에 전해진 data를(from browser. json)
CommentSerializer로 변환해온다 (to django. python)
4. 데이터베이스에 저장
    * 시리얼라이저가 유효하다면,  
    Comment 모델의 형식에 맞게 시리얼라이징된 mesaage를 creator와 image를 함께 DB(postgreSQL)에 저장한다.
    * 시리얼라이저가 유효하지 않다면 -> 400

```python
# images/urls.py
from django.conf.urls import url
from . import views

app_name = "images" # Django 2.0 need it.
urlpatterns = [
    
    ...
    # 1. 댓글을 작성할 URL 생성
    url(
        regex=r"(?P<image_id>\w+)/comment",
        view=views.CommentOnImage.as_view(),
        name="comment_image"
    )
]


# images/views.py
class CommentOnImage(APIView):
    
    def post(self, request, image_id, format=None):
        
        user = request.user
        
        # 2. URL의 "image_id"에 해당하는 이미지가 있는지 확인
        try:
            found_image = models.Image.objects.get(id=image_id)
        except models.Image.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # 3. POST request로 받아온 message 시리얼라이징 (json -> python)
        serializer = serializers.CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            
            # 4. 시리얼라이징된 message를 creator, image와 함께 DB에 저장 
            serializer.save(creator=user, image=found_image)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
            
        else:
            
            return Response(data=serializer.errors, status=status.HTTP_404_NOT_FOUND)
```

* **`Model.DoesNotExist` 예외처리**   
`QuerySet.get()`로 찾는 오브젝트가 없을때, `DoesNotExist`속성을 사용하여 특정 Model을 캐치하여 try/except 구문을 통해 예외처리를 한다. [문서](https://docs.djangoproject.com/en/2.0/ref/models/instances/#django.db.models.Model.DoesNotExist)

### # 내가 생각하는 Serializer의 흐름  
> json obj --(serializer)--> python obj --(django)--> SQL --> DB(postgreSQL)에 저장
1. 웹사이트에서 댓글을 POST한다  
`textarea의 댓글 -> json`  
    ```python
    print(request.data) # {'message': '댓글성공?'}
    ```
2. 장고는 json객체를 python객체로 Serializing한다  
`json -> python` 
    ```python
    print(serializer.data) 
    # {'creator': OrderedDict([('username', 'admin'), ('profile_image', None)]), 'id': 10, 'message': '댓글성공?'}
    ```
3. 장고는 python객체를 데이터베이스가 이해할 수 있는 SQL언어로 작성하여 DB(postgreSQL)에 저장한다  
`python -> SQL`

---
# #1-46 Deleting my own comment

```python 
class Comment(APIView):
    
    def delete(self, request, comment_id, format=None):
        
        user = request.user
        
        try:
            # login한 유저의 댓글만 지울수 있도록 제한
            comment = models.Comment.objects.get(id=comment_id, creator=user)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except models.Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
```