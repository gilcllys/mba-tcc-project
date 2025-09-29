#!/usr/bin/env python
import os
import sys
import subprocess
import threading
import signal
import time

def run_consumer():
    """Executa o consumer em uma thread separada"""
    print("🐰 [CONSUMER] Iniciando consumer RabbitMQ...")
    try:
        # Aguardar RabbitMQ estar disponível - aumentado para 15 segundos
        print("⏳ [CONSUMER] Aguardando RabbitMQ estar disponível...")
        time.sleep(15)
        os.system("python manage.py consume_orders")
    except Exception as e:
        print(f"❌ [CONSUMER] Erro ao iniciar consumer: {e}")

def run_django():
    """Executa o servidor Django"""
    print("🌐 [DJANGO] Iniciando servidor Django...")
    try:
        os.system("python manage.py runserver 0.0.0.0:8081")
    except Exception as e:
        print(f"❌ [DJANGO] Erro ao iniciar Django: {e}")

def signal_handler(sig, frame):
    """Handler para parar os processos graciosamente"""
    print("⚠️ Parando serviços...")
    sys.exit(0)

if __name__ == "__main__":
    print("🚀 [STARTUP] Iniciando order_service...")
    
    # Aguardar banco de dados estar disponível
    print("⏳ [DATABASE] Aguardando conexão com banco de dados...")
    time.sleep(10)
    
    # Aplicar migrações
    print("📦 [MIGRATIONS] Aplicando migrações...")
    migration_result = os.system("python manage.py migrate")
    if migration_result != 0:
        print("❌ [MIGRATIONS] Erro ao aplicar migrações, tentando novamente...")
        time.sleep(5)
        os.system("python manage.py migrate --run-syncdb")
    else:
        print("✅ [MIGRATIONS] Migrações aplicadas com sucesso!")
    
    # Configurar handler para sinais
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # PRIMEIRA PRIORIDADE: Iniciar consumer em thread separada
    print("⚡ [PRIORITY] Iniciando consumer RabbitMQ como prioridade...")
    consumer_thread = threading.Thread(target=run_consumer)
    consumer_thread.daemon = True
    consumer_thread.start()
    
    # Aguardar consumer inicializar completamente
    print("⏳ [WAIT] Aguardando consumer RabbitMQ inicializar...")
    time.sleep(10)
    
    # SEGUNDA PRIORIDADE: Executar Django (processo principal)
    print("▶️ [START] Agora iniciando API Django...")
    run_django()