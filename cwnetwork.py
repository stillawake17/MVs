import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

# Load data and create the NetworkX graph
data = pd.read_excel("C:\\Users\\josti\\OneDrive\\Documents\\00 - Ephemeral Boutique\\0 - data analysis\\Merchant Venturers\\members.xlsx")

G = nx.from_pandas_edgelist(data, source='Name', target='Connection')


# Assuming G is your main network
# Step 1: Identify nodes with the keyword "Clark Wilmott"
clark_wilmott_nodes = [node for node in G.nodes() if "Clark Wilmott" in node]

# Step 2: Extract these nodes and their immediate neighbors
subnetwork_nodes = clark_wilmott_nodes + [neighbor for node in clark_wilmott_nodes for neighbor in G.neighbors(node)]
subgraph = G.subgraph(subnetwork_nodes)

# Step 3: Visualize the subnetwork
plt.figure(figsize=(10, 10))
pos = nx.spring_layout(subgraph)
nx.draw(subgraph, pos, with_labels=True, node_color="skyblue")
plt.title("Subnetwork around 'Clark Wilmott'")
plt.show()
