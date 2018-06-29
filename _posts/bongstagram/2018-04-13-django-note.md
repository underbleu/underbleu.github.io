# # Django: Backend
## Framework vs Library
> A library is a tool, A frame work is a way of life

* A Library is just function you can call
* A Framework calls your code


## Virtual Environment (가상환경)

* 하나의 환경에 다양한 버전의 python, pip를 설치하는 것은 위험하다.  
* 프로젝트마다 다른 버전이 필요하기 때문에 각각에 맞는 가상환경 사용하는 것
* 그리고 우리는 각각의 가상환경을 "버블"이라고 부를 것이다

>pipenv creates a virtual environment on our computer so we can install packages without doing it globally (bubble kind of way)

1. 버블 생성 (생성했을뿐, 아직 버블환경안에 있는것은 아님)  
`$ pipenv --three`  
-> Pipfile이 생성됨 (버블 환경이 어떻게 생겼는지 설명. `package.json`과 비슷)
2. Django 설치  
`$ pipenv install django`  
-> pipfile의 [packages]에 Django 추가
3. 버블 안으로 진입  
`$ pipenv shell`
4. 설치한 모듈 실행 가능  
`$ django-admin`

---
# #1-5. Parts of Django

## 1. Settings
* 장고의 디폴트 세팅 (ex. 타임존, 언어설정...)
* 필요한 세팅을 추가/삭제하여 커스터마이징 가능

## 2. Urls
* 장고는 Urls에 해당하는 view function을 실행한다 

## 3. App
* view fucntion들이 저장되어 있다
* 장고 프로젝트를 구성하는 정교한 톱니바퀴라고 볼 수 있다

---

# #1-6. Creating our Django Project

장고 프로젝트를 생성할때 크기가 너무 커지지않게 고려해야한다.
production-ready-size

## 1. 장고 기본 구성으로 프로젝트 생성하기 (심플)  
```
$ django-admin startproject [project-name]
```

## 2. Cookiecutter에서 제공하는 뼈대로 프로젝트 생성하기  
Django 프로젝트를 빨리 시작할 수 있도록 미리 만들어진 앱의 구조 (Create React App과 비슷)  

>* global에 모듈을 설치하려면 `pip`
>* 버블(가상환경)에 설치하려면 `pipenv`

```bash
$ pipenv install cookiecutter
$ pipenv shell
$ cookiecutter https://github.com/pydanny/cookiecutter-django
```

* 프로젝트 생성 & 커스터마이징 옵션
    * license: MIT
    * task_runner: None
    * postgresql_version: 9.6
    * windows: y
    * 이외에 모든 설정 no 선택
    * 불필요 파일 삭제 (docs, utility, travis.yml, CONTRIBUTORS.txt, env.example, README.rst, .coveragerc)

>클로닝 vs 쿠키커팅  
>* 클로닝은 그대로 복사해오는것
>* 쿠키커팅은 내 필요에 맞게 커스터마이징하여 복사해오는것

---

# # 1-8. Installing the requirements

## requirements 폴더
pipenv가 이것을 보고 해당버전/환경에 필요한 것들을 설치
* `production.txt` -> 서버에 필요한 파일 (내컴퓨터에는 설치 X) -> live server
* `local.txt` -> 내컴퓨터(로컬) 환경에 필요한 파일 -> local server
* `base.txt` -> 서버 & 내컴퓨터 모두에 설치할 디폴트값 (global 설정)

`$ pipenv install -r requirements/local.txt` -> pipfile에 추가됨

---

#  #1-9. Production settings and local settings

어디서 코딩을 하냐에 따라 config > settings 폴더안에 있는 `local.py / production.py ...` 세팅 파일을 골라서 쓸 수 있다.

* Production Settings:  
Settings that are gonna be loaded on the **live server**

* Local Settings:  
Settings that are gonna be loaded on the **local server**

---

# #1-10. Databases and Django

장고는 database agnostic(자유사상가?)  
어떤 데이터베이스 (SQL, NoSQL, graph)와도 연결해서 쓸 수 있다,

1. postgresSQL 설치
2. 환경변수 > 시스템변수 > PostgreSQL 루트 2개 추가  
    * `C:\Program Files\PostgreSQL\9.6\bin`  
    * `C:\Program Files\PostgreSQL\9.6\lib`
3. postgreSQL 터미널 열기. cmd  
`$ psql -U postgres postgres`
4. PostgreSQL 실행하여 bongstagram 데이터베이스 생성  
`$ CREATE DATABASE bongstgram;`
5. base.py 설정변경  
    ```python
    DATABASES = {
        'default': env.db('DATABASE_URL',
        default='postgres://유저네임:비밀번호@localhost:5432/bongstagram'),
    }
    ```
6. 서버구동  
`$ python manage.py runserver`

---

# #1-12. Creating the Apps

1. 이미지앱 생성하기  
bonstagram/bongstagram 폴더에서  
`$ django-admin startapp images` -> images폴더 생성됨
2. 이미지앱 이름 지정
    ```python
    # bongstagram/bongstagram/images/apps.py

    class ImagesConfig(AppConfig):
        name = 'bongstagram.images'
    ```

3. LOCAL_APPS에 이미지앱 추가 
    * DJANGO_APPS : 장고설치시 디폴트로 설치되는 APPS
    * THIRD_PARTY_APPS : 인터넷에서 별도로 설치한 APPS
    * LOCAL_APPS : 내가 생성한 APPS -> images앱 이곳에 추가하자!!
    
```python
# settings/base.py

DJANGO_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
]
THIRD_PARTY_APPS = [
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    # 'crispy_forms', 삭제
    # 'rest_framework', 삭제
]
LOCAL_APPS = [
    'bongstagram.users.apps.UsersConfig',
    'bontstagram.images.apps.ImagesConfig', # 추가!!
]
```

* 불필요파일 삭제  
bongstagram/bongstagram/template폴더 삭제

---

# # 1-13. Models and Views

* URLs
* Views
* Models: **Shape of Data** that you are going to save on the database(postgreSQL)

![Django-flow](images/django-flow.png)

---

# # 1-14. What is the Django ORM?

ORM (Object-relational mappers)
* 장고ORM은 Python과 SQL언어 사이의 통역사 같은 것
* Python으로 코드를 짜면 장고가 SQL로 번역해주고
* 데이터베이스는 SQL을 이해한다

---

# # 1-15. Recap- Class Inheritance

## Field
* Defining a Model
* 장고가 어떤 자료형이 저장될지 database에 알려줌
* Data를 validation하여 제한해줌
* [Model field reference](https://docs.djangoproject.com/es/1.10/ref/models/fields/#field-types)

## Field Type
* BooleanField
* DateField
* EmailField
* FileField
* URLField
## Relation Fields
* ForeignKey
* ManyToManyField


CharField | TextField
--- | ---
short text | long text
`max_length` 필수 | `max_length` 옵션


```python
from django.db import models

class Cat(models.Model):
    name = models.CharField(max_length=30) # name의 max_length를 30글자로 제한
```

## Query Sets
### Model Operation
* All Cats
    * create()
    * get()
    * filter()
    * all()
* One Cat
    * save()
    * delete()


### Lookup Options
* startwith
* contains
* istartwith (대/소문자 구분X)
* icontains
* lt (less than)
* gt (greater than)  
...

```py
images = models.Image.objects.filter(name__contains='blabla')
```
---

# # 1-17. Migrating

## Migration이란?  
Model의 모양을 바꾸기위한 데이터베이스 프로세스이다.
* Model, Applications(유저, 이미지...) 필드를 추가/변경/삭제한 후에는, 항상 migration 후 서버를 구동시켜줘야한다.

```bash
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py runserver
```

---

# # 1-18. Creating a super user & User Model

1. super user 생성  
`$ python manage.py createsuperuser`

2. default로 만들어진 User 클래스에 부족한 정보칼럼을 추가
    * AbstractUser  
    : has fields such as 'username', 'email', 'first_name', 'last_name' that we extend
    ```python
    # users/models.py
    class User(AbstractUser):
        
        GENDER_CHOICES = (
            ('male', 'Male'),
            ('female', 'Female'),
            ('not-specified', 'Not specified')
        )
        
        name = models.CharField(_("Name of User"), blank=True, max_length=255)
        website = models.URLField(null=True)
        bio = models.TextField(null=True)
        phone = models.CharField(max_length=140, null=True)
        gender = models.CharField(max_length=80, choices=GENDER_CHOICES, null=True)
    ```

3. Models에 변화가 생겼으니 Migration을 해준다
    ```bash
    $ pipenv shell
    $ python manage.py makemigrations # users/migrations에 AddField된 파일생성
    $ python manage.py migrate
    ```

---

# # 1-20 Creating the Image Model

>[Model field reference](https://docs.djangoproject.com/es/1.10/ref/models/fields/#field-types)

* AbstractModel  
    * 데이터베이스에 연결되지 않지만, 다른 Model들의 Base를 깔아주는 Model.  
    * 반복코드 작성을 피하기위한 **일종의 blueprint**
* `abstract=True` in the Meta class.  
This model will then not be used to create any database table. Instead, when it is used as a base class for other models  
* `auto_now_add` / `auto_now`  
Save data automatically to the model when `created / updated`
```python
# images/models.py
from django.db import models

class TimeStampedModel(models.Model):

    created_at = models.DateTimeField(auto_now_add=True) # 자동 저장
    updated_at = models.DateTimeField(auto_now=True) # 자동 저장
    
    class Meta:
        abstract = True # 다른 모델들을 위한 base (DB에 저장X)

class Image(TimeStampedModel):

    file = models.ImageField()
    location = models.CharField(max_length=140)
    caption = models.TextField()

class Comment(TimeStampedModel):

    message = models.TextField()
```
-> Image Model 작성후 Migration !

---

# # 1-21. Model Relationships

## ForeignKey
* 다른 모델의 ID를 저장하여 관계를 만들어주는 Key
* The ID field of a related model
* pk(primary key): 장고의 ID를 의미함. pk=id
* 필드가()가 비워져있으면 안됨 -> `null=True`를 디폴트로 채워준다.
```python
class Cat(models.Model):
    name = models.CharField(max_length=30)
    owner = models.ForeignKey(Owner, pk=2) # Owner모델의 pk2와 연결
```

## _set 속성
* relation이 있는 모든 object들을 그룹화하는 속성
* `모델이름_set`으로 호출
* DB에 칼럼생성 X
```python
nicolas = Owner.objects.get(id=1)
nico_cats = nicolas.cat_set.all() ## nico의 모든 고양이
```
![_set property](images/_set.png)

## Many To Many
>ex.  
>Cats have `ForeignKey` to Owner.  
>Owner has ManyToMany to himself (=많은 고양이들을 소유)

* Many Users Follow Many Users (relationship)
* DB에 칼럼생성 O. 필드()가 비워져있어도됨.

```python
class User(AbstractUser):
    
    ...
    
    followers = models.ManyToManyField("self")
    following = models.ManyToManyField("self")
    
```
![ManyToMany_followers](images/ManyToMany_followers.png)

---

# # 1-22 Created the Like model

* ForeignKey는 ManyToOne / OneToMany의 의미로 볼 수 있다
* import시 models 중복이생기면 오류가 생길 수 있어 `user_models`같은 닉네임을 지정해준다.
```python
# images/models.py
from django.db import models
from bongstagram.users import models as user_models # 닉네임생성 

class Like(TimeStampedModel):
    
    # Django 2.0 ForeignKey field requires "on_delete" argument
    creator = models.ForeignKey(user_models.User, null=True, on_delete=models.PROTECT)
    image = models.ForeignKey(Image, null=True, on_delete=models.PROTECT)
```

---

# #1-24 Registering the Models in the admin

## `@` 데코레이터
* 선언할 함수 앞에 `@decorator`를 붙여 본체를 꾸며준다(=기능을 더해준다)
* 로그를 남기거나 유저의 로그인 상태등을 확인하여 로그인 상태가 아니면 로그인 페이지로 리더랙트(redirect)하기 위해서 많이 사용된다
* `@admin.register(...)`  
ModelAdmin class를 등록하기 위한 데코레이터
```python
from django.contrib import admin
from . import models

# Image Model 속성을 가지고있는 ImageAdmin class를 등록
@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    pass
```

---

# #1-25 Customizing the Django Admin

## `__str__`
string representation. 텍스트를 어떻게 보이게할 지 설정하는 메소드

* 파일명 -> "location-caption" 으로 표시해주기  
ex. `screenshot02.png` -> `Gangnam - South of Seoul`

```python
# images/models.py

class Image(TimeStampedModel):

    file = models.ImageField()
    location = models.CharField(max_length=140)
    caption = models.TextField()
    creator = models.ForeignKey(user_models.User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return '{} - {}'.format(self.location, self.caption)
```

## Admin패널 커스터마이징

>[ModelAdmin Options](https://docs.djangoproject.com/en/1.11/ref/contrib/admin/#django.contrib.admin.ModelAdmin.list_display)

* `list_display_links`: 이미지 수정 페이지링크
* `search_field`: 검색창. 검색어 설정가능
* `list_filter`
* `list_display`:리스트를 정렬하는 항목지정

```python 
# images/admin.py 

@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    
    list_display_links = (
        'location',
    )
    
    search_fields = (
        'location',
        'caption'
    )
    
    list_filter = (
        'location',
        'creator',
    )
    
    list_display = (
        'file',
        'location',
        'caption',
        'creator',
        'created_at',
        'updated_at',
    )
```

---

# # 1-25 HTTP Requests

HTML (HyperText Markup Language): HyperText를 작성하는 언어  
HTTP (HyperText Transfer Protocol): HyperText를 전달하는 프로토콜

* Client - Request
    * Header > Method
        * C  POST
        * R  GET
        * U  PUT
        * D  DELETE
    * Body

* Server - Response  
Request의 Method에 따라 응답함

---

# # 1-26 REST API

> [RESTful API Designing guidelines ](https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9)

---

