const fastify = require('fastify');

const { server } = require('../src/server.ts');
const prisma = require('../node_modules/@prisma/client');

beforeAll(async () => {
  await server.ready();
});

afterAll(async () => {
  await prisma.$disconnect();
  await server.close();
});

describe('Entries API', () => {
  test('GET /api/entries returns all entries', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/entries',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('entries');
    expect(response.json().entries.length).toBeGreaterThan(0);
  });

  test('POST /api/entries creates a new entry', async () => {
    const entryData = {
      title: 'Test Entry',
      description: 'This is a test entry',
      created_at: new Date(),
      scheduled_date: new Date(),
    };

    const response = await server.inject({
      method: 'POST',
      url: '/api/entries',
      payload: entryData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('entry');
    expect(response.json().entry.title).toBe(entryData.title);

    const entry = await prisma.entry.findUnique({
      where: { id: response.json().entry.id },
    });

    expect(entry).toBeTruthy();
    expect(entry.title).toBe(entryData.title);
  });

  test('PUT /api/entries/:id updates an entry', async () => {
    const entryData = {
      title: 'Test Entry',
      description: 'This is a test entry',
      created_at: new Date(),
      scheduled_date: new Date(),
    };

    const newTitle = 'New Test Title';

    const response1 = await server.inject({
      method: 'POST',
      url: '/api/entries',
      payload: entryData,
    });

    const entryId = response1.json().entry.id;

    const response2 = await server.inject({
      method: 'PUT',
      url: `/api/entries/${entryId}`,
      payload: { title: newTitle },
    });

    expect(response2.statusCode).toBe(200);
    expect(response2.json()).toHaveProperty('entry');
    expect(response2.json().entry.title).toBe(newTitle);

    const updatedEntry = await prisma.entry.findUnique({
      where: { id: response1.json().entry.id },
    });

    expect(updatedEntry.title).toBe(newTitle);
  });

  test('DELETE /api/entries/:id deletes an entry', async () => {
    const entryData = {
      title: 'Test Entry',
      description: 'This is a test entry',
      created_at: new Date(),
      scheduled_date: new Date(),
    };

    const response1 = await server.inject({
      method: 'POST',
      url: '/api/entries',
      payload: entryData,
    });

    const entryId = response1.json().entry.id;

    const response2 = await server.inject({
      method: 'DELETE',
      url: `/api/entries/${entryId}`,
    });

    expect(response2.statusCode).toBe(204);

    const deletedEntry = await prisma.entry.findUnique({
      where: { id: entryId },
    });

    expect(deletedEntry).toBeFalsy();
  });
});