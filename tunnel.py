import subprocess
import time
import sys

print("Iniciando tunel permanente...")
while True:
    try:
        proc = subprocess.Popen(["npx.cmd", "--yes", "localtunnel", "--port", "8100", "--subdomain", "auditacampus"])
        proc.wait()
    except Exception as e:
        print("Error en tunel, reintentando...", e)
    time.sleep(2)
