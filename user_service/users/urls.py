from rest_framework import routers
from users.viewsets import ClientViewSet
from django.urls import path, include


router = routers.SimpleRouter()
router.register(r'client', ClientViewSet)


urlpatterns = router.urls
