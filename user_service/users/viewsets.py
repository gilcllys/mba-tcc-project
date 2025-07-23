from users.serializer import ClientSerializer
from users.models import Client
from rest_framework import viewsets


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
