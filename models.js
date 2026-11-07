// Triangular prism with separate vertices per face for crisp edges and brick UVs.
function createPrism() {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  const a = [-1, -1, 1], b = [1, -1, 1], c = [0, 1, 1];
  const d = [-1, -1, -1], e = [1, -1, -1], f = [0, 1, -1];
  function face(vertices, uv) {
    const origin = vertices[0];
    const u = vertices[1].map((v, i) => v - origin[i]);
    const v = vertices[2].map((value, i) => value - origin[i]);
    const cross = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
    const length = Math.hypot(...cross), edgeLength = Math.hypot(...u);
    const normal = cross.map(value => value / length);
    const tangent = u.map(value => value / edgeLength);
    const base = positions.length / 3;
    vertices.forEach((vertex, i) => {
      positions.push(...vertex);
      normals.push(...normal);
      tangents.push(...tangent);
      texCoords.push(...uv[i]);
    });
    for (let i = 1; i < vertices.length - 1; i++) indices.push(base, base+i, base+i+1);
  }
  const triangleUV = [[0,0], [1,0], [0.5,1]];
  const rectangleUV = [[0,0], [1,0], [1,1], [0,1]];
  face([a,b,c], triangleUV);  // front
  face([e,d,f], triangleUV);  // back
  face([d,e,b,a], rectangleUV);  // bottom
  face([b,e,f,c], rectangleUV);  // right slope
  face([d,a,c,f], rectangleUV);  // left slope
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}
// Sphere: latitude runs from the top to the bottom.
function createSphere(rows = 32, segments = 64) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    const phi = Math.PI * v;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments, theta = 2 * Math.PI * u;
      const x = Math.sin(phi) * Math.sin(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.cos(theta);
      positions.push(x, y, z);
      normals.push(x, y, z);
      tangents.push(Math.cos(theta), 0, -Math.sin(theta));
      texCoords.push(u, 1 - v);
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + segments + 1;
      if (j > 0) indices.push(a, b, a + 1);
      if (j < rows - 1) indices.push(a + 1, b, b + 1);
    }
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

// Cone: radius 1, bottom y = -1, tip y = 1.
function createCone(segments = 64) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, theta = 2 * Math.PI * u;
    const s = Math.sin(theta), c = Math.cos(theta);
    positions.push(s, -1, c, 0, 1, 0);
    for (let j = 0; j < 2; j++) {
      normals.push(2 * s / Math.sqrt(5), 1 / Math.sqrt(5), 2 * c / Math.sqrt(5));
      tangents.push(c, 0, -s);
      texCoords.push(u, j);
    }
  }
  for (let i = 0; i < segments; i++) {
    const k = 2 * i;
    indices.push(k, k + 2, k + 1);
  }

  // Bottom disk has its own downward normal.
  const center = positions.length / 3;
  positions.push(0, -1, 0);
  normals.push(0, -1, 0);
  tangents.push(1, 0, 0);
  texCoords.push(0.5, 0.5);
  for (let i = 0; i <= segments; i++) {
    const theta = 2 * Math.PI * i / segments;
    const s = Math.sin(theta), c = Math.cos(theta);
    positions.push(s, -1, c);
    normals.push(0, -1, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5 + 0.5 * s, 0.5 + 0.5 * c);
  }
  for (let i = 0; i < segments; i++) {
    indices.push(center, center + i + 2, center + i + 1);
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}


