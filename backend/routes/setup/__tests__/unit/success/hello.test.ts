import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../../../server.js';

describe('GET /api/setup/health/hello', () => {
  it('should return a 200 status code', async () => {
    const response = await request(app).get('/api/setup/health/hello');
    expect(response.status).toBe(200);
  });

  it('should return a JSON response with the correct message', async () => {
    const response = await request(app).get('/api/setup/health/hello');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello World from Dottie API!');
  });

  it('should only include the message property in the response', async () => {
    const response = await request(app).get('/api/setup/health/hello');
    expect(Object.keys(response.body).length).toBe(1);
    expect(Object.keys(response.body)[0]).toBe('message');
  });
}); 