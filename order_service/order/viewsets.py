from order.serializer import OrderSerializer, OrderItemSerializer
from order.models import Order, OrderItem
from rest_framework import viewsets


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()
