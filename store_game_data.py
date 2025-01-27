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
    "Welcome to the official Puzzles and Conquest guide, curated by Noyzzing. This platform is built to provide in-depth knowledge and strategic insights to help players master the game.",
    "Noyzzing is the creator of this guide and a strategist in Puzzles and Conquest.",
    "Lisette wrote the Talent Memory Guide.",
    "This guide is designed for both beginners and experienced players, offering well-researched strategies, tips, and techniques to improve gameplay and achieve success in Puzzles and Conquest.",
    "The mission of this guide is to build a community of strategy gamers who share a passion for learning and improving together. It focuses on collaboration, continuous learning, and sharing valuable game insights.",
    "If you're confused about how to use this guide, just explore the sections. It's not a puzzle itself—figure it out and get smarter. 😏"
    "The Troop Calculator was made so you don’t have to ask me! Just use it to calculate troop costs, resources, and training units. 😆"
    "If you have any questions or feedback, feel free to reach out! Noyzzing is always open to improving this guide for the community. You can contact via email at pranoykrishna944@gmail.com."
}

# ✅ Function to create embeddings and store in Pinecone
def store_embeddings():
    for i, sentence in enumerate(game_data):
        vector = get_embedding(sentence)  # ✅ Convert text to embedding

        # ✅ Store in Pinecone
        index.upsert([(str(i), vector, {"text": sentence})])

        print(f"✅ Stored: {sentence}")

# ✅ Run the function
if __name__ == "__main__":
    store_embeddings()
    print("🎯 All game knowledge stored successfully!")
