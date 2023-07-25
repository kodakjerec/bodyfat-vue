import asyncio
import json
import random
from websockets.server import serve

# 用來保存所有客戶端的連線物件
connected_clients = set()

async def echo(websocket, path):
    connected_clients.add(websocket)
    try:
        msg = {"msg":"Connected"}
        await websocket.send(json.dumps(msg))
        async for message in websocket:
            print('echo '+ path + message)
            await broadcast()
    finally:
        # 客戶端斷線時，從持續連線的集合中刪除連線物件
        connected_clients.remove(websocket)

# 廣播訊息給所有連線的客戶端
async def broadcast():
    # 每三秒廣播一次訊息
    while True:
        msg = { "version": random.randrange(1,100,2) }
        # 對所有連線的客戶端進行廣播
        for client in connected_clients:
            await client.send(json.dumps(msg))
        await asyncio.sleep(5)

async def main():
    async with serve(echo, "localhost", 8000):
        await asyncio.Future()  # run forever

asyncio.get_event_loop().run_until_complete(main())