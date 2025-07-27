import pika
import json
from order.models import Order


def callback(ch, method, properties, body):
    order_data = json.loads(body)
    Order.objects.create(
        item=order_data['item'],
        quantity=order_data['quantity']
    )
    print("Pedido salvo:", order_data)


def start_order_consumer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost', 5672))
    channel = connection.channel()
    channel.queue_declare(queue='orders')
    channel.basic_consume(
        queue='orders', on_message_callback=callback, auto_ack=True)
    print('Aguardando pedidos...')
    channel.start_consuming()
