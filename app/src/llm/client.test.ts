import { describe, expect, test, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { LLMClient } from './client';

const mockCreate = vi.fn();
vi.mock('openai', () => {
  return {
    OpenAI: vi.fn().mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    })),
  };
});

beforeEach(() => {
  mockCreate.mockReset();
});

describe('LLMClient', () => {
  test('returns parsed response on success', async () => {
    const schema = z.object({ message: z.string() });
    mockCreate.mockResolvedValue({ choices: [{ message: { content: '{"message":"hi"}' } }] });
    const client = new LLMClient('key');
    const result = await client.chat('say hi', { schema, systemPrompt: 'system' });
    expect(result.error).toBeNull();
    expect(result.response).toEqual({ message: 'hi' });
    expect(mockCreate).toHaveBeenCalled();
  });

  test('parses json inside code fences', async () => {
    const schema = z.object({ msg: z.string() });
    mockCreate.mockResolvedValue({ choices: [{ message: { content: '```json\n{"msg":"hi"}\n```' } }] });
    const client = new LLMClient('key');
    const result = await client.chat('hi', { schema, systemPrompt: 'system' });
    expect(result.error).toBeNull();
    expect(result.response).toEqual({ msg: 'hi' });
  });

  test('retries on invalid json', async () => {
    const schema = z.object({ msg: z.string() });
    mockCreate
      .mockResolvedValueOnce({ choices: [{ message: { content: 'oops' } }] })
      .mockResolvedValueOnce({ choices: [{ message: { content: '{"msg":"ok"}' } }] });
    const client = new LLMClient('key');
    const result = await client.chat('prompt', { schema, systemPrompt: 'sys', maxRetries: 2 });
    expect(result.error).toBeNull();
    expect(result.response).toEqual({ msg: 'ok' });
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  test('returns error after max retries', async () => {
    const schema = z.object({ val: z.number() });
    mockCreate.mockResolvedValue({ choices: [{ message: { content: 'bad' } }] });
    const client = new LLMClient('key');
    const result = await client.chat('p', { schema, systemPrompt: 'sys', maxRetries: 1 });
    expect(result.error).not.toBeNull();
    expect(result.response).toBeNull();
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test('chatMessages uses provided messages', async () => {
    const schema = z.object({ msg: z.string() });
    mockCreate.mockResolvedValue({ choices: [{ message: { content: '{"msg":"ok"}' } }] });
    const client = new LLMClient('key');
    const result = await client.chatMessages([{ role: 'user', content: 'hi' }], { schema, systemPrompt: 'sys' });
    expect(result.error).toBeNull();
    expect(result.response).toEqual({ msg: 'ok' });
    expect(mockCreate).toHaveBeenCalled();
  });
});
