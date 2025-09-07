import asyncio
from app.db.session import engine
from app.db.base_class import Base
from app.models import User, Conversation, Message  # Import all models

async def init_db():
    async with engine.begin() as conn:
        # Drop all tables (for development only)
        # await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    print("Initializing database...")
    asyncio.run(init_db())
    print("Database initialized.")
