from rest_framework import routers
from order.viewsets import OrderViewSet
from django.urls import path, include


router = routers.SimpleRouter()
router.register(r'order_client', OrderViewSet)


urlpatterns = router.urls
