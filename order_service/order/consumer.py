from order.models import Order
import pika
import json


def callback(ch, method, properties, body):
    print(f"[CONSUMER] Mensagem recebida: {body}")
    try:
        order_data = json.loads(body)
        print(f"[CONSUMER] Dados do pedido decodificados: {order_data}")

        order = Order.objects.create(
            client_id=order_data['client_id'],
            order_item_id=order_data['order_item_id'],
            quantity=order_data['quantity']
        )
        print(f"[CONSUMER] Pedido salvo no banco com ID: {order.id} - Dados: {order_data}")
    except Exception as e:
        print(f"[CONSUMER] Erro ao processar pedido: {str(e)}")


def start_order_consumer():
    print("[CONSUMER] Iniciando consumidor de pedidos...")
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters('rabbitmq', 5672))  # Usar nome do serviço
        channel = connection.channel()
        channel.queue_declare(queue='orders')
        channel.basic_consume(
            queue='orders', on_message_callback=callback, auto_ack=True)
        print('[CONSUMER] Consumidor conectado e aguardando pedidos...')
        channel.start_consuming()
    except Exception as e:
        print(f"[CONSUMER] Erro ao conectar ao RabbitMQ: {str(e)}")
