import test from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES_2D, SHAPES_3D, validHex, clampSize, polygonPoints, studioFileName } from '../shape-utils.js';

test('available shapes are defined', () => {
  assert.ok(SHAPES_2D.includes('circle'));
  assert.ok(SHAPES_3D.includes('sphere'));
});
test('validate hex color', () => {
  assert.equal(validHex('#7357ef'), true);
  assert.equal(validHex('#xyz123'), false);
  assert.equal(validHex('7357ef'), false);
});
test('clamp size to the supported range', () => {
  assert.equal(clampSize(5), 15);
  assert.equal(clampSize(75), 75);
  assert.equal(clampSize(999), 160);
  assert.throws(() => clampSize('bad'), TypeError);
});
test('compute vertices on a regular polygon', () => {
  const triangle = polygonPoints(3, 10, 5, 5);
  assert.equal(triangle.length, 3);
  for (const point of triangle) assert.ok(Math.abs(Math.hypot(point.x - 5, point.y - 5) - 10) < 1e-10);
  assert.throws(() => polygonPoints(2, 5), RangeError);
});
test('export filename matches studio mode', () => {
  assert.equal(studioFileName('2d'), 'formfanz-2d.png');
  assert.equal(studioFileName('sketch'), 'formfanz-sketch.png');
  assert.throws(() => studioFileName('invalid'), TypeError);
});
