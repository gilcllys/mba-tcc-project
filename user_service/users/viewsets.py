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
        item = request.data.get('item')
        quantity = request.data.get('quantity')
        if not item or not quantity:
            return Response({'error': 'item e quantity são obrigatórios.'}, status=400)
        order_data = {
            'client_id': client.id,
            'client_name': client.name,
            'item': item,
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
