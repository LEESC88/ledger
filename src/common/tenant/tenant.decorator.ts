import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts and normalizes the tenant identifier from the `x-user-id` request header.
 * Defaults to `'default'` when absent or blank so downstream services always receive a non-empty string.
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ headers?: Record<string, string | string[] | undefined> }>();
    const raw = req?.headers?.['x-user-id'];
    const value = Array.isArray(raw) ? raw[0] : raw;
    const normalized = typeof value === 'string' ? value.trim() : '';
    return normalized || 'default';
  },
);
