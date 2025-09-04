from users.behaviors.user_autocomplete_behavior import UserAutocompleteBehavior
from users.serializer import ClientSerializer
from users.models import Client
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import pika
import json


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()

    @action(detail=True, methods=['post'])
    def fazer_pedido(self, request, pk=None):
        client = self.get_object()
        order_item_id = request.data.get('order_item_id')
        quantity = request.data.get('quantity')
        if not item or not quantity:
            return Response({'error': 'item e quantity são obrigatórios.'}, status=400)
        order_data = {
            'client_id': client.id,
            'order_item_id': order_item_id,
            'quantity': quantity
        }
        connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='orders')
        channel.basic_publish(
            exchange='',
            routing_key='orders',
            body=json.dumps(order_data)
        )
        connection.close()
        return Response({'message': 'Pedido enviado para a fila com sucesso!', 'order': order_data})

    @action(detail=False, methods=['post'])
    def auto_complete_users(self, request, pk=None):
        try:
            name = request.query_params.get('name', '')
            data = UserAutocompleteBehavior(name).execute()
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response({'result': data})
