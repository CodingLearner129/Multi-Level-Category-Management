import request from 'supertest';
import app from '../app';
import "./setup";
import { dbConnect, dbDisconnect, deleteCollectionData } from './setup';

beforeAll(async () => {
  await dbConnect();
});

afterEach(async () => {
  await deleteCollectionData();
});

afterAll(async () => {
  await dbDisconnect();
});

describe('Auth API', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 'password123', confirm_password: 'password123' });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('does not allow email invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test', password: 'pass1234', confirm_password: 'pass1234' });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it('does not allow password as an integer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 123, confirm_password: 123 });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it('does not allow password with length less then 8', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 'pass123', confirm_password: 'pass123' });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it('does not allow confirm password and password to be deferent', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 'password123', confirm_password: 'password1234' });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
  });

  it('does not allow duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({ email: 'dupe@test.com', password: 'pass1234', confirm_password: 'pass1234' });
    const res = await request(app).post('/api/auth/register').send({ email: 'dupe@test.com', password: 'pass1234', confirm_password: 'pass1234' });
    expect(res.body.status).toBe(0);
  });

  it('logs in a registered user', async () => {
    await request(app).post('/api/auth/register').send({ email: 'login@test.com', password: '12345678', confirm_password: "12345678" });
    const res = await request(app).post('/api/auth/login').send({ email: 'login@test.com', password: '12345678' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});
