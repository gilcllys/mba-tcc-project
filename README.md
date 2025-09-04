# MBA TCC Project

Sistema de Pedidos com Mensageria e Filas

Este projeto foi desenvolvido para estudos de arquitetura de sistemas distribuídos, mensageria e filas, utilizando Django Rest Framework, RabbitMQ e Angular. O objetivo é simular um fluxo real de pedidos, onde clientes realizam solicitações e essas são processadas de forma assíncrona por meio de filas.

## Visão Geral

- **user_service**: API responsável pelo cadastro e gestão de clientes. Permite criar, listar e buscar clientes, além de enviar pedidos para a fila RabbitMQ.
- **order_service**: API responsável pelo cadastro e gestão de pedidos e itens do cardápio. Consome os pedidos da fila e os processa, simulando o fluxo de uma cozinha ou atendimento.
- **order_system (Angular)**: Interface web para interação dos usuários, permitindo cadastrar clientes, fazer pedidos, visualizar itens do cardápio e acompanhar o processamento dos pedidos.
- **RabbitMQ**: Broker de mensageria que conecta as APIs, garantindo que os pedidos sejam processados de forma ordenada e resiliente.

## Como funciona o fluxo

1. O cliente é cadastrado via user_service ou pela interface Angular.
2. O cliente faz um pedido, que é enviado para a fila RabbitMQ.
3. O order_service consome os pedidos da fila e os salva no banco de dados, simulando o processamento.
4. O frontend Angular permite visualizar clientes, pedidos e itens do cardápio, além de interagir com as APIs.

## Módulos

### user_service
- **models.py**: Define o modelo `Client`.
- **viewsets.py**: Expõe endpoints REST para clientes e inclui o endpoint de envio de pedidos para a fila.
- **behaviors/**: Lógica de autocomplete e outras regras de negócio.

### order_service
- **models.py**: Define os modelos `Order` e `OrderItem`.
- **viewsets.py**: Expõe endpoints REST para pedidos e itens do cardápio. Inclui autocomplete e integração com comportamentos customizados.
- **behaviors/**: Lógica de autocomplete para itens do cardápio.
- **consumer.py**: Consome pedidos da fila RabbitMQ e salva no banco.
- **management/commands/consume_orders.py**: Comando customizado para rodar o consumidor de pedidos.
auto_complete_users
### order_system (Angular)
- **src/app/page/client/**: Cadastro e listagem de clientes.
- **src/app/page/food/**: Cadastro e listagem de itens do cardápio.
- **src/app/service/**: Serviços para comunicação com as APIs.
- **src/app/shared/**: Componentes reutilizáveis, como dialogs de edição.
- **Estilização**: Customização de feedback visual com snackbar e toastr para sucesso/erro.

## Como rodar o projeto

1. Suba o RabbitMQ localmente:
   ```sh
   sudo systemctl start rabbitmq-server
   # ou via Docker
   docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672auto_complete_users:15672 rabbitmq:3-management
   ```
2. Inicie o user_service:
   ```sh
   cd user_service
   source ../venv/bin/activate
   python manage.py runserver 8000
   ```
3. Inicie o order_service:
   ```sh
   cd order_service
   source ../venv/bin/activate
   python manage.py runserver 8001
   python manage.py consume_orders
   ```
4. Inicie o frontend Angular:
   ```sh
   cd order_system
   npm install
   npm start
   ```

## Tecnologias Utilizadas
- Django Rest Framework
- RabbitMQ
- Angular
- Pika (Python)
- Ngx-Toastr (Angular)
- Material Design (Angular)

## Diferenciais
- Arquitetura orientada a eventos e filas.
- Separação clara entre módulos de cliente, pedido e cardápio.
- Autocomplete inteligente para busca de clientes e itens.
- Feedback visual customizado para ações do usuário.
- Código organizado e pronto para estudos acadêmicos ou evolução para produção.

---

Sinta-se à vontade para contribuir, estudar ou adaptar este projeto para suas necessidades!
