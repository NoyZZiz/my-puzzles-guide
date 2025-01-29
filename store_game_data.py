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
    
    embedding = outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]  # Compute embedding
    
    print(f"📏 Embedding Shape: {len(embedding)}")  # ✅ Debugging step

    return embedding

# ✅ Example game knowledge to store
game_data = {
    "Welcome to the official Puzzles and Conquest guide, curated by Noyzzing. This platform is built to provide in-depth knowledge and strategic insights to help players master the game.",
    "Noyzzing is the creator of this guide and a strategist in Puzzles and Conquest.",
    "Lisette wrote the Talent Memory Guide.",
    "This guide is designed for both beginners and experienced players, offering well-researched strategies, tips, and techniques to improve gameplay and achieve success in Puzzles and Conquest.",
    "The mission of this guide is to build a community of strategy gamers who share a passion for learning and improving together. It focuses on collaboration, continuous learning, and sharing valuable game insights.",
    "If you're confused about how to use this guide, just explore the sections. It's not a puzzle itself—figure it out and get smarter. 😏"
    "The Troop Calculator was made so you don’t have to ask me! Just use it to calculate troop costs, resources, and training units. 😆"
     "If you need to calculate how many resources or speed-ups you need, check out the Troop Calculator—it does the math for you!"
    "If you have any questions or feedback, feel free to reach out! Noyzzing is always open to improving this guide for the community. You can contact via email at pranoykrishna944@gmail.com."
}
infantry_data = {
    "The Infantry Barracks in Puzzles and Conquest is essential for training foot soldiers. It unlocks after completing Chapter 2 of the Main Quest Campaign.", 
    "Infantry units are crucial for close combat. The barracks allow you to train different types of infantry, each with unique combat abilities and equipment.", 
    "You can check the Infantry Barracks menu to see troop stats, power, rations consumed, and the load they contribute during a march.",
    "Training infantry requires resources. The cost depends on the unit type and development level.",
    "Like other buildings, the Infantry Barracks can be upgraded from level 1 to 40, but troop unlocks are based on your Castle Level.",
    "Infantry troop types unlock at different *Castle Levels: Recruit at **Castle Level 1, Warrior at **Castle Level 4, Gladiator at **Castle Level 7, Champion at **Castle Level 10, Elite Champion at **Castle Level 13, and so on up to Crusade Warmaster at **Castle Level 40*.",
    "Infantry troops are strong against Ranged units but weak against Cavalry. In battles, Infantry is used as the frontline, absorbing damage while countering archers.", 
    "Cavalry is the biggest threat to Infantry due to their mobility and charge attacks. To avoid heavy losses, Infantry should be positioned carefully with proper formations."
}
ranged_data = {
    "The Ranged Barracks in Puzzles and Conquest is essential for training Ranged troops. These troops specialize in long-range attacks and are crucial for breaking through enemy defenses.", 
    "Ranged troops excel in offensive battles, especially against fortified positions like Walls. They are also highly effective in Monster Hunting and long-range engagements on the battlefield.",
    "On the World Map, Ranged troops can be deployed for military campaigns, allowing players to use their full combat potential against enemies and monsters.",  
    "The Ranged Barracks, like other buildings, can be upgraded from level 1 to 40, but troop unlocks are based on your Castle Level.",
    "Ranged troop types unlock at different *Castle Levels: Archer at **Castle Level 1, Bowman at **Castle Level 4, Hunter at **Castle Level 7, Sniper at **Castle Level 10, Elite Sniper at **Castle Level 13, and so on up to Crusade Deadshot at **Castle Level 40*.",
    "Ranged units are effective against Cavalry because they can strike from a distance before Cavalry reaches them. Their firepower allows them to weaken Cavalry charges before impact.",
    "Infantry is the biggest counter to Ranged units. Infantry troops can absorb arrow damage and overwhelm Ranged units in close combat, making them a significant threat."
}
cavalry_data = {
     "The Cavalry Barracks in Puzzles and Conquest is essential for training Cavalry troops. This building allows you to train mounted warriors, improve their combat skills, and enhance their battle effectiveness.",
    "Cavalry units are highly mobile and excel at bypassing Traps. They provide strong support for Infantry during castle sieges and Hell Fortress battles.", 
    "Like other troops, Cavalry have different armor and training levels, which can be viewed in the Cavalry Barracks menu. Troop attributes such as Might, Rations, Load, Resource Costs, and Training Time improve as Cavalry levels increase.",
    "The Cavalry Barracks, like other buildings, can be upgraded from level 1 to 40, but troop unlocks are based on your Castle Level.",  
    "Cavalry troop types unlock at different *Castle Levels: Scout at **Castle Level 1, Horseman at **Castle Level 4, Cavalier at **Castle Level 7, Knight at **Castle Level 10, Elite Knight at **Castle Level 13, and so on up to Crusade Overlord at **Castle Level 40*.",
    "Cavalry units are strong against Infantry due to their high mobility and charge attacks. They can break through frontline Infantry formations and disrupt enemy lines.", 
    "Ranged units are the biggest counter to Cavalry. Their ability to strike from a distance allows them to weaken Cavalry before they can engage in close combat."
}
siege_data = [
    "Siege troops in Puzzles and Conquest are completely useless in battles. They serve no real purpose in the game, and upgrading them is a complete waste of resources.",
    "The only reason to train Siege troops is to complete the daily quest. You should only produce 250 T1 Siege per day and nothing more.",
    "If you're wondering whether Siege units are important, just check Apex Matches or Legion Showdown. You won’t see Siege there because they are irrelevant.",
    "Thinking about training high-tier Siege troops? Bad idea. Investing resources in Siege is one of the worst decisions you can make in the game.",
    "Oh, you actually want to train Siege? That’s adorable. Maybe next, you’ll ask how to lose battles faster.",
    "If you're relying on Siege to win fights, you might as well just donate your resources to your enemies. It would be more effective.",
    "Did you wake up today and decide to be useless? Because that’s what training Siege does to your army.",
    "Congrats! You just found the fastest way to waste resources and destroy your barracks space."
]

# ✅ Function to create embeddings and store in Pinecone
def store_embeddings(data, category):
    for i, sentence in enumerate(data):
        vector = get_embedding(sentence)  # ✅ Convert text to embedding

        # ✅ Store in Pinecone with category metadata
        index.upsert([(str(i), vector, {"text": sentence, "category": category})])

        print(f"✅ Stored ({category}): {sentence}")

# ✅ Run the function
if __name__ == "__main__":
    print("🚀 Starting data storage...")
    
    store_embeddings(infantry_data, "infantry")
    store_embeddings(ranged_data, "ranged")
    store_embeddings(cavalry_data, "cavalry")
    store_embeddings(siege_data, "siege")

    print("🎯 All game knowledge stored successfully!")
