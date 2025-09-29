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

    @action(detail=False, methods=['post'])
    def fazer_pedido(self, request, pk=None):
        print(f"[DEBUG] Recebendo dados do pedido: {request.data}")

        client_id = request.data.get('client_id')
        order_item_id = request.data.get('order_item_id')
        quantity = request.data.get('quantity')

        print(f"[DEBUG] client_id: {client_id}, order_item_id: {order_item_id}, quantity: {quantity}")

        if not order_item_id or not quantity:
            print("[DEBUG] Erro: item e quantity são obrigatórios")
            return Response({'error': 'item e quantity são obrigatórios.'}, status=400)

        order_data = {
            'client_id': client_id,
            'order_item_id': order_item_id,
            'quantity': quantity
        }

        try:
            print("[DEBUG] Conectando ao RabbitMQ...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters('rabbitmq'))  # Usar nome do serviço
            channel = connection.channel()

            print("[DEBUG] Declarando fila 'orders'...")
            channel.queue_declare(queue='orders')

            print(f"[DEBUG] Enviando mensagem para a fila: {order_data}")
            channel.basic_publish(
                exchange='',
                routing_key='orders',
                body=json.dumps(order_data)
            )
            connection.close()
            print("[DEBUG] Mensagem enviada com sucesso!")

            return Response({'message': 'Pedido enviado para a fila com sucesso!', 'order': order_data})
        except Exception as e:
            print(f"[DEBUG] Erro ao enviar para RabbitMQ: {str(e)}")
            return Response({'error': f'Erro ao enviar pedido: {str(e)}'}, status=500)

    @action(detail=False, methods=['post'])
    def auto_complete_users(self, request, pk=None):
        try:
            name = request.query_params.get('name', '')
            data = UserAutocompleteBehavior(name).execute()
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response({'result': data})
