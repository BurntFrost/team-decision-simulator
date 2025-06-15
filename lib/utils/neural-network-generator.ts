export interface NeuralNode {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'soma' | 'dendrite' | 'axon';
  intensity: number;
  delay: number;
  cluster: number;
  dendrites: { x: number; y: number; length: number }[];
}

export interface NeuralConnection {
  id: string;
  from: NeuralNode;
  to: NeuralNode;
  strength: number;
  delay: number;
  path: string; // SVG path for organic curves
  synapses: { x: number; y: number; delay: number }[];
}

export interface NetworkConfig {
  nodeCount: number;
  connectionDensity: number;
  clusterCount: number;
  dendriteCount: number;
  maxConnectionDistance: number;
}

// Generate organic bezier curve path between two points
const generateOrganicPath = (from: NeuralNode, to: NeuralNode): string => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Create control points for natural curve
  const midX = from.x + dx * 0.5;
  const midY = from.y + dy * 0.5;
  
  // Add some organic variation to the curve
  const variation = distance * 0.2;
  const angle = Math.atan2(dy, dx) + Math.PI / 2;
  
  const cp1X = from.x + dx * 0.3 + Math.cos(angle) * variation * (Math.random() - 0.5);
  const cp1Y = from.y + dy * 0.3 + Math.sin(angle) * variation * (Math.random() - 0.5);
  
  const cp2X = from.x + dx * 0.7 + Math.cos(angle) * variation * (Math.random() - 0.5);
  const cp2Y = from.y + dy * 0.7 + Math.sin(angle) * variation * (Math.random() - 0.5);
  
  return `M ${from.x} ${from.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${to.x} ${to.y}`;
};

// Generate dendrite branches for a neuron
const generateDendrites = (node: NeuralNode, count: number): { x: number; y: number; length: number }[] => {
  const dendrites = [];
  const angleStep = (Math.PI * 2) / count;
  
  for (let i = 0; i < count; i++) {
    const angle = angleStep * i + (Math.random() - 0.5) * 0.5;
    const length = 2 + Math.random() * 3;
    const x = node.x + Math.cos(angle) * length;
    const y = node.y + Math.sin(angle) * length;
    
    dendrites.push({ x, y, length });
  }
  
  return dendrites;
};

// Generate neural network with realistic topology
export const generateNeuralNetwork = (config: NetworkConfig): { nodes: NeuralNode[]; connections: NeuralConnection[] } => {
  const nodes: NeuralNode[] = [];
  const connections: NeuralConnection[] = [];
  
  // Generate clusters for realistic neural organization
  const clusters = [];
  for (let i = 0; i < config.clusterCount; i++) {
    clusters.push({
      centerX: 10 + Math.random() * 80,
      centerY: 10 + Math.random() * 80,
      radius: 15 + Math.random() * 10,
    });
  }
  
  // Generate nodes within clusters
  for (let i = 0; i < config.nodeCount; i++) {
    const cluster = clusters[i % config.clusterCount];
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * cluster.radius;
    
    const x = cluster.centerX + Math.cos(angle) * radius;
    const y = cluster.centerY + Math.sin(angle) * radius;
    
    // Ensure nodes stay within bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    const node: NeuralNode = {
      id: `neuron-${i}`,
      x: clampedX,
      y: clampedY,
      size: 2 + Math.random() * 2,
      type: 'soma',
      intensity: 0.7 + Math.random() * 0.3,
      delay: Math.random() * 2,
      cluster: i % config.clusterCount,
      dendrites: [],
    };
    
    // Generate dendrites for this neuron
    node.dendrites = generateDendrites(node, config.dendriteCount);
    
    nodes.push(node);
  }
  
  // Generate connections with realistic constraints
  for (let i = 0; i < nodes.length; i++) {
    const fromNode = nodes[i];
    const maxConnections = Math.floor(config.connectionDensity * nodes.length);
    let connectionCount = 0;
    
    for (let j = 0; j < nodes.length && connectionCount < maxConnections; j++) {
      if (i === j) continue;
      
      const toNode = nodes[j];
      const distance = Math.sqrt(
        Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
      );
      
      // Connection probability based on distance and cluster affinity
      const sameCluster = fromNode.cluster === toNode.cluster;
      const distanceFactor = Math.max(0, 1 - distance / config.maxConnectionDistance);
      const clusterBonus = sameCluster ? 0.3 : 0;
      const connectionProbability = (distanceFactor + clusterBonus) * config.connectionDensity;
      
      if (Math.random() < connectionProbability) {
        const connection: NeuralConnection = {
          id: `connection-${i}-${j}`,
          from: fromNode,
          to: toNode,
          strength: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 2,
          path: generateOrganicPath(fromNode, toNode),
          synapses: [
            {
              x: toNode.x,
              y: toNode.y,
              delay: Math.random() * 0.5,
            },
          ],
        };
        
        connections.push(connection);
        connectionCount++;
      }
    }
  }
  
  return { nodes, connections };
};

// Deterministic network generation for consistent SSR
export const generateDeterministicNetwork = (config: NetworkConfig, seed: number = 42): { nodes: NeuralNode[]; connections: NeuralConnection[] } => {
  // Simple seeded random number generator
  let seedValue = seed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  const nodes: NeuralNode[] = [];
  const connections: NeuralConnection[] = [];
  
  // Generate deterministic clusters
  const clusters = [];
  for (let i = 0; i < config.clusterCount; i++) {
    clusters.push({
      centerX: 10 + seededRandom() * 80,
      centerY: 10 + seededRandom() * 80,
      radius: 15 + seededRandom() * 10,
    });
  }
  
  // Generate deterministic nodes
  for (let i = 0; i < config.nodeCount; i++) {
    const cluster = clusters[i % config.clusterCount];
    const angle = seededRandom() * Math.PI * 2;
    const radius = seededRandom() * cluster.radius;
    
    const x = cluster.centerX + Math.cos(angle) * radius;
    const y = cluster.centerY + Math.sin(angle) * radius;
    
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    const node: NeuralNode = {
      id: `neuron-${i}`,
      x: clampedX,
      y: clampedY,
      size: 2 + seededRandom() * 2,
      type: 'soma',
      intensity: 0.7 + seededRandom() * 0.3,
      delay: seededRandom() * 2,
      cluster: i % config.clusterCount,
      dendrites: [],
    };
    
    // Generate deterministic dendrites
    const dendriteCount = config.dendriteCount;
    const angleStep = (Math.PI * 2) / dendriteCount;
    
    for (let d = 0; d < dendriteCount; d++) {
      const dendriteAngle = angleStep * d + (seededRandom() - 0.5) * 0.5;
      const length = 2 + seededRandom() * 3;
      const dendriteX = node.x + Math.cos(dendriteAngle) * length;
      const dendriteY = node.y + Math.sin(dendriteAngle) * length;
      
      node.dendrites.push({ x: dendriteX, y: dendriteY, length });
    }
    
    nodes.push(node);
  }
  
  // Generate deterministic connections
  for (let i = 0; i < nodes.length; i++) {
    const fromNode = nodes[i];
    const maxConnections = Math.floor(config.connectionDensity * nodes.length);
    let connectionCount = 0;
    
    for (let j = 0; j < nodes.length && connectionCount < maxConnections; j++) {
      if (i === j) continue;
      
      const toNode = nodes[j];
      const distance = Math.sqrt(
        Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
      );
      
      const sameCluster = fromNode.cluster === toNode.cluster;
      const distanceFactor = Math.max(0, 1 - distance / config.maxConnectionDistance);
      const clusterBonus = sameCluster ? 0.3 : 0;
      const connectionProbability = (distanceFactor + clusterBonus) * config.connectionDensity;
      
      if (seededRandom() < connectionProbability) {
        // Generate deterministic organic path
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const pathDistance = Math.sqrt(dx * dx + dy * dy);
        
        const variation = pathDistance * 0.2;
        const pathAngle = Math.atan2(dy, dx) + Math.PI / 2;
        
        const cp1X = fromNode.x + dx * 0.3 + Math.cos(pathAngle) * variation * (seededRandom() - 0.5);
        const cp1Y = fromNode.y + dy * 0.3 + Math.sin(pathAngle) * variation * (seededRandom() - 0.5);
        
        const cp2X = fromNode.x + dx * 0.7 + Math.cos(pathAngle) * variation * (seededRandom() - 0.5);
        const cp2Y = fromNode.y + dy * 0.7 + Math.sin(pathAngle) * variation * (seededRandom() - 0.5);
        
        const path = `M ${fromNode.x} ${fromNode.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${toNode.x} ${toNode.y}`;
        
        const connection: NeuralConnection = {
          id: `connection-${i}-${j}`,
          from: fromNode,
          to: toNode,
          strength: 0.5 + seededRandom() * 0.5,
          delay: seededRandom() * 2,
          path,
          synapses: [
            {
              x: toNode.x,
              y: toNode.y,
              delay: seededRandom() * 0.5,
            },
          ],
        };
        
        connections.push(connection);
        connectionCount++;
      }
    }
  }
  
  return { nodes, connections };
};
