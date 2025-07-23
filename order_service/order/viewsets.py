from order.serializer import OrderSerializer
from order.models import Order
from rest_framework import viewsets


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
