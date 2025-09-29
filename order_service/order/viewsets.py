from order.serializer import OrderSerializer, OrderItemSerializer
from order.models import Order, OrderItem
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from order.behaviors.order_item_autocomplete_behavior import OrderItemAutocompleteBehavior


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()

    @action(detail=False, methods=['post'])
    def auto_complete_order_items(self, request, pk=None):
        try:
            name = request.query_params.get('name', '')
            data = OrderItemAutocompleteBehavior(name).execute()
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response({'result': data})
