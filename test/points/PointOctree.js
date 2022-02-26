import test from "ava";
import { Box3, Vector3 } from "three";
import { PointOctree } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const data0 = {};
const data1 = {};
const data2 = {};

test("can be instantiated", t => {

	const object = new PointOctree();
	t.pass();

});

test("can add a point", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	t.true(octree.set(new Vector3(0, 0, 0), data0), "should succeed");
	t.is(octree.countPoints(), 1, "should be able to add a point");

});

test("overwrites duplicates", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	octree.set(new Vector3(0, 0, 0), data0);
	octree.set(new Vector3(0, 0, 0), data1);
	octree.set(new Vector3(1, 0, 0), data2);

	t.is(octree.countPoints(), 2, "should overwrite duplicates");

});

test("can remove a point", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	octree.set(new Vector3(0, 0, 0), data0);

	t.is(octree.remove(new Vector3(0, 0, 0)), data0, "should return the data of the removed point");
	t.is(octree.countPoints(), 0, "should remove a point completely");

});

test("can look a point up", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	t.is(octree.get(new Vector3(0, 0, 0)), null, "should return null if there is no point");

	octree.set(new Vector3(0, 0, 0), data0);

	t.is(octree.get(new Vector3(0, 0, 0)), data0, "should find points and return their data");

});

test("adds points to intersecting octants", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	octree.set(new Vector3(2, 0, 0), data0);

	t.is(octree.countPoints(), 0, "should not add if the point lies outside");

});

test("splits octants that are at maximum capacity", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

	octree.set(new Vector3(0, 0, 0), data0);
	octree.set(new Vector3(1, 0, 0), data1);

	t.is(octree.getDepth(), 1, "should split octants when necessary");
	t.is(octree.countPoints(), 2, "should not lose any points during a split");

});

test("merges octants if possible", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

	octree.set(new Vector3(0, 0, 0), data0);
	octree.set(new Vector3(1, 0, 0), data1);
	octree.set(new Vector3(0.9, 0, 0), data2);

	octree.remove(new Vector3(1, 0, 0));

	t.is(octree.getDepth(), 1, "should merge octants when possible");

});

test("can move points", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

	octree.set(new Vector3(0.5, 0.5, 0.5), data0);
	octree.set(new Vector3(-0.5, -0.5, -0.5), data1);

	const result0 = octree.move(new Vector3(0.5, 0.5, 0.5), new Vector3(0.5, 0.6, 0.5));
	const result1 = octree.move(new Vector3(-0.5, -0.5, -0.5), new Vector3(1, -0.5, 1));

	t.is(octree.countPoints(), 2, "should correctly relocate points");
	t.is(result0, data0, "should return the data of the updated point");
	t.is(result1, data1, "should return the data of the updated point");
	t.is(octree.get(new Vector3(0.5, 0.6, 0.5)), data0, "should correctly update points");
	t.is(octree.get(new Vector3(1, -0.5, 1)), data1, "should correctly update points");

});

test("can find the nearest point", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

	octree.set(new Vector3(0, 0, 0), null);
	octree.set(new Vector3(0.2, 0, 0), data1);
	octree.set(new Vector3(0.3, 0, 0), data0);
	octree.set(new Vector3(-0.75, -0.75, -0.75), data2);
	octree.set(new Vector3(-1, -1, -1), data2);

	t.is(octree.findNearestPoint(new Vector3(0.2, 0, 0)).data, data1, "should find the nearest point");
	t.is(octree.findNearestPoint(new Vector3(-0.9, -0.9, -0.9)).data, data2, "should find the nearest point");
	t.is(octree.findNearestPoint(new Vector3(0.2, 0, 0), Infinity, true).data, data0, "should be able to skip itself");

});

test("can find points inside a radius", t => {

	const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

	octree.set(new Vector3(0, 0, 0), data0);
	octree.set(new Vector3(0, 0.1, 0.005), data0);
	octree.set(new Vector3(-0.075, -0.1, 0.005), data1);
	octree.set(new Vector3(1, 0, 0), data1);
	octree.set(new Vector3(0.9, 0, 0), data2);
	octree.set(new Vector3(0.9, 0, 0.00125), data2);

	t.is(octree.findPoints(new Vector3(0, 0, 0), 0.15).length, 3, "should find points inside a radius");
	t.is(octree.findPoints(new Vector3(0, 0, 0), 0.15, true).length, 2, "should be able to skip itself");

});

test("retrieves leaves when octree is small", (t) => {
  const octree = new PointOctree(box.min, box.max);

  octree.set(new Vector3(0.0, 0, 0), data0);
  octree.set(new Vector3(0.1, 0, 0), data1);
  octree.set(new Vector3(0.2, 0, 0), data2);

  const found = [];
  for (let node of octree.leaves()) {
    if (!node.data) continue;
    const { points } = node.data;
    if (points) {
      for (let point of points) found.push(point);
    }
  }

  t.is(found.length, 3, "should find points");
});

test("retrieves leaves when octree is large", (t) => {
  const octree = new PointOctree(box.min, box.max);

  for (let i = 0; i < 100; i++) {
    octree.set(new Vector3(0 + i / 100, 0, 0), data0);
  }

  const found = [];
  for (let node of octree.leaves()) {
    if (!node.data) continue;
    const { points } = node.data;
    if (points) {
      for (let point of points) found.push(point);
    }
  }

  t.is(found.length, 100, "should find points");
});
