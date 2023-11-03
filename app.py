from flask import Flask, jsonify, render_template
import networkx as nx
import pandas as pd

import networkx as nx

# Create an empty network
G = nx.Graph()
# Load data and create the NetworkX graph
data = pd.read_excel("C:\\Users\\josti\\OneDrive\\Documents\\00 - Ephemeral Boutique\\0 - data analysis\\Merchant Venturers\\members.xlsx")

# Add nodes and edges based on the data
for index, row in data.iterrows():
    person = row[0]
    G.add_node(person)  # Add the person as a node
    
    for link in row[1:].dropna():
        G.add_node(link)  # Add the organization/person as a node
        G.add_edge(person, link)  # Add an edge between the person and the organization/person

# Return basic information about the network
G_info = nx.info(G)
G_info



# ... the rest of your Flask code ...


def convert_network_to_json(G):
    """
    Convert a NetworkX graph G into a JSON-serializable dictionary.
    """
    data = {
        "nodes": [{"id": node, "label": node} for node in G.nodes()],
        "edges": [{"from": edge[0], "to": edge[1]} for edge in G.edges()]
    }
    return data


app = Flask(__name__)

@app.route('/')
def index():
    # Convert your network (G) to a format suitable for frontend (e.g., JSON)
    network_data = convert_network_to_json(G)
    return render_template('network.html', data=network_data)

@app.route('/subnetwork/<node_name>')
def get_subnetwork(node_name):
    # Extract subnetwork for node_name
    # Convert subnetwork to a format suitable for frontend (e.g., JSON)
    return jsonify(subnetwork_data)

if __name__ == '__main__':
    app.run(debug=True)
