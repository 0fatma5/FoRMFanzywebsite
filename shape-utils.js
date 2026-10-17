export const SHAPES_2D = ['circle', 'square', 'rectangle', 'triangle', 'pentagon', 'hexagon', 'star', 'heart'];
export const SHAPES_3D = ['sphere', 'cube', 'cone', 'cylinder', 'torus', 'icosahedron'];
export function validHex(color) { return /^#[0-9a-fA-F]{6}$/.test(color); }
export function clampSize(size) {
  if (!Number.isFinite(Number(size))) throw new TypeError('Shape size must be a number');
  return Math.min(160, Math.max(15, Number(size)));
}
export function polygonPoints(sides, radius, centerX = 0, centerY = 0, offset = -Math.PI / 2) {
  if (!Number.isInteger(sides) || sides < 3 || sides > 64 || !Number.isFinite(radius) || radius <= 0) throw new RangeError('Invalid polygon');
  return Array.from({length:sides}, (_,i)=> {
    const a=offset + i*Math.PI*2/sides;
    return {x:centerX+Math.cos(a)*radius,y:centerY+Math.sin(a)*radius};
  });
}
export function studioFileName(mode) {
  if (!['2d','3d','sketch'].includes(mode)) throw new TypeError('Unknown studio mode');
  return 'formfanz-' + mode + '.png';
}
