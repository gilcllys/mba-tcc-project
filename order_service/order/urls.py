from rest_framework import routers
from order.viewsets import OrderViewSet, OrderItemViewSet
from django.urls import path, include


router = routers.SimpleRouter()
router.register(r'order_client', OrderViewSet)
router.register(r'order_item', OrderItemViewSet)


urlpatterns = router.urls
