from django.core.management.base import BaseCommand
from order.consumer import start_order_consumer


class Command(BaseCommand):
    help = 'Inicia o consumidor de pedidos do RabbitMQ'

    def handle(self, *args, **kwargs):
        start_order_consumer()
