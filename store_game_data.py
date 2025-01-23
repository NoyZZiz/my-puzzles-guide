import os
import pinecone
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from transformers import AutoTokenizer, AutoModel
import torch

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# ✅ Get Pinecone Index Name
index_name = os.getenv("PINECONE_INDEX_NAME")

# ✅ Check if the index exists, if not, create it
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1024,  # ✅ Matches the Pinecone index
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=os.getenv("PINECONE_ENV"))
    )
    print(f"✅ Pinecone index '{index_name}' created successfully.")

# ✅ Connect to the existing Pinecone index
index = pc.Index(index_name)
print(f"✅ Connected to Pinecone index: {index_name}")

# ✅ Load Hugging Face Embedding Model
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en")
model = AutoModel.from_pretrained("BAAI/bge-large-en")

# ✅ Function to convert text to embeddings
def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]

# ✅ Example game knowledge to store
game_data = {
    "What is Noyzzing?": "Noyzzing is the creator of this guide and a strategist in Puzzles and Conquest.",
    "Who wrote the Talent Memory Guide?": "Lisette wrote the Talent Memory Guide.",
    "How do I use this guide?": "Oh, come on! This isn't a puzzle itself. Just explore the sections and get smarter. 😏",
    "What about the troop calculator?": "Why did we create a calculator if you're just going to ask me? 😆",
}

# ✅ Function to create embeddings and store in Pinecone
def store_embeddings():
    for question, answer in game_data.items():
        vector = get_embedding(question)  # ✅ Convert text to embedding

        # ✅ Store in Pinecone
        index.upsert([(question, vector, {"answer": answer})])

        print(f"✅ Stored: {question}")

# ✅ Run the function
if __name__ == "__main__":
    store_embeddings()
    print("🎯 All game knowledge stored successfully!")
