import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# ✅ Get Pinecone Index Name
index_name = os.getenv("PINECONE_INDEX_NAME")
index_info = pc.describe_index(index_name)
print(index_info)
# ✅ Check if the index exists, if not, create it
if index_name not in pc.list_indexes().names():
    print(f"🆕 Creating Pinecone index: {index_name}")
    pc.create_index(
        name=index_name,
        dimension=1024,  # ✅ Ensure this matches Hugging Face embeddings
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=os.getenv("PINECONE_ENV"))
    )
    print(f"✅ Pinecone index '{index_name}' created successfully.")

# ✅ Connect to the existing Pinecone index
index = pc.Index(index_name)
print(f"✅ Connected to Pinecone index: {index_name}")

# ✅ Print Pinecone Index Stats
print("📊 Pinecone Index Stats:", index.describe_index_stats())