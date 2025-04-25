import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import "./setup";
import Category from '../models/Category';
import { dbConnect, dbDisconnect, deleteCollectionData } from './setup';

let token: string;

beforeAll(async () => {
  await dbConnect();
});

beforeEach(async () => {
  const regRes = await request(app).post('/api/auth/register').send({ email: 'cat@test.com', password: '12345678', confirm_password: "12345678" });
  const loginRes = await request(app).post('/api/auth/login').send({ email: 'cat@test.com', password: '12345678' });
  token = loginRes.body.data.token;
});

afterEach(async () => {
  await deleteCollectionData();
});

afterAll(async () => {
  await dbDisconnect();
});

describe('Category API', () => {
  it('does not allow unauthorized user', async () => {
    const res = await request(app)
      .get('/api/category')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGI0ZTgwOGUwYzg2YjI2NzExYjhjMyIsImlhdCI6MTc0NTU3MjE2NiwiZXhwIjoxNzQ1NjU4NTY2fQ.zbagImkOCF6QKvGpfbwwOj3VsSENS5Gxrn3am6EuaMU`);

    expect(res.status).toBe(403);
  });

  it('creates a category', async () => {
    const res = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Books' });

    expect(res.status).toBe(200);
    expect(res.body.data.category.name).toBe('Books');
  });

  it('does not allow name as an integer', async () => {
    const res = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 123 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });
  
  it('does not allow duplicate to create category', async () => {
    await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Books' });

    const res = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Books' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it('creates a child category and fetches tree', async () => {
    const root = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tech' });

    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'AI', parent_id: root.body.data.category._id });

    const res = await request(app)
      .get('/api/category')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.categories[0].subCategories.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.categories[0].subCategories[0].name).toBe('AI');
  });

  it('updates a category status to inactive and deactivates children', async () => {
    const root = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Parent' });

    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Child', parent_id: root.body.data.category._id });

    await request(app)
      .put(`/api/category/${root.body.data.category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'inactive' });

    const updatedChild = await Category.findById(child.body.data.category._id);
    expect(updatedChild?.status).toBe('inactive');
  });

  it('deletes a category and reassigns children to parent', async () => {
    const parent = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Top' });

    const middle = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Middle', parent_id: parent.body._id });

    const leaf = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Leaf', parent_id: middle.body._id });

    await request(app)
      .delete(`/api/category/${middle.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    const updatedLeaf = await Category.findById(leaf.body._id);
    expect(updatedLeaf?.parent_id?.toString()).toBe(parent.body._id);
  });
});
